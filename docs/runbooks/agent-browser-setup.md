# Runbook: agent-browser setup for the Stevie web UI

This runbook documents how to get `agent-browser` — the Chrome-automation
CLI (v0.27.0, bundling **Chrome for Testing 149**) — driving the Stevie web UI at
**https://stevie.localhost:3443** on three platforms:

- **macOS** (Apple Silicon or Intel)
- **Linux x86** (a typical Ubuntu dev server)
- **Coder sandbox** (Linux ARM / `arm64`)

The goal on every platform is the same: from a fresh environment, reach a **non-blank screenshot
of the dispatch board**. Start with the common flow below, then apply the per-platform delta.

---

## Common flow: install + launch + verify

These steps are identical on all three platforms. Per-platform sections only document the
*delta* from this flow.

### 1. Install

```bash
agent-browser install
```

This downloads the bundled Chrome for Testing 149 build and the daemon. On a fresh machine this
is the only install step required (subject to the per-platform notes below about the executable
path on `arm64`).

### 2. Launch + navigate to the UI

```bash
agent-browser open https://stevie.localhost:3443
```

This starts (or reuses) the daemon, opens a browser context, and navigates to the dispatch board.

### 3. Capture a screenshot

```bash
agent-browser screenshot --out dispatch-board.png
```

Open `dispatch-board.png`. A **non-blank screenshot of the dispatch board** means success. A
blank/white page or an interstitial error page means one of the per-platform fixes below is
needed.

### 4. Fastest pass/fail check: `agent-browser doctor` "Launch test"

The quickest way to confirm the browser can actually launch and render is:

```bash
agent-browser doctor
```

Look at the **"Launch test"** line in the doctor output. It launches the configured Chrome build,
loads a page, and reports pass/fail. This is the single check the reader should use to confirm a
fix took effect — it is faster than the full open + screenshot loop and surfaces sandbox and
certificate failures directly.

> Run `agent-browser doctor` after **every** environment-variable change below; the "Launch test"
> line is your source of truth for whether the daemon is now healthy.

---

## Environment variables and the daemon-restart caveat

Two environment variables fix the two verified failures on Linux x86 (see that section for the
full cause/remedy). Both are also relevant to the `arm64` delta.

| Variable | Purpose |
| --- | --- |
| `AGENT_BROWSER_ARGS="--no-sandbox"` | Pass extra flags to Chrome; here, disable the Chrome sandbox to work around restricted unprivileged user namespaces. |
| `AGENT_BROWSER_IGNORE_HTTPS_ERRORS=1` | Ignore TLS errors so the self-signed dev cert on `stevie.localhost` does not block navigation. |
| `AGENT_BROWSER_EXECUTABLE_PATH=/path/to/chromium` | Use a system Chromium instead of the bundled Chrome for Testing build (relevant on `arm64`). |

### ⚠️ These variables are read **only at daemon launch**

`agent-browser` runs a long-lived background daemon. The variables above are read **once, when
the daemon process starts**. Exporting a new value in your shell has **no effect on an
already-running daemon** — a stale daemon will keep using the old (or empty) values, and your fix
will appear not to work.

**Whenever you change any `AGENT_BROWSER_*` variable, restart the daemon first:**

```bash
# 1. Close all open browser contexts.
agent-browser close --all

# 2. Kill the daemon process so it re-reads the environment on next launch.
#    Find the daemon pid (e.g. via the printed pid, `pgrep -f agent-browser`, or
#    `agent-browser status`) and terminate it:
kill "$(pgrep -f 'agent-browser.*daemon')"

# 3. Re-export the variables, then launch again so the daemon inherits them.
export AGENT_BROWSER_ARGS="--no-sandbox"
export AGENT_BROWSER_IGNORE_HTTPS_ERRORS=1
agent-browser open https://stevie.localhost:3443
```

If a fix "doesn't take", the cause is almost always a stale daemon. Re-run
`agent-browser doctor` after the restart to confirm.

---

## Platform: macOS

**Delta from the common flow: none in the typical case.**

On macOS, `agent-browser install` provides the correct Chrome for Testing 149 build, the Chrome
sandbox works normally (so **no `--no-sandbox` / `AGENT_BROWSER_ARGS`** is required), and you do
**not** need a custom `AGENT_BROWSER_EXECUTABLE_PATH`.

Self-signed-cert handling: if your local trust store already trusts the Stevie dev cert, no
change is needed. If navigation is blocked by `net::ERR_CERT_AUTHORITY_INVALID`, set
`AGENT_BROWSER_IGNORE_HTTPS_ERRORS=1` (and restart the daemon — see the caveat above), exactly as
on Linux x86.

Steps:

```bash
agent-browser install
agent-browser open https://stevie.localhost:3443
agent-browser screenshot --out dispatch-board.png
agent-browser doctor   # "Launch test" should pass
```

**End state:** a non-blank screenshot of the dispatch board, with `doctor` "Launch test" passing.

---

## Platform: Linux x86 (Ubuntu dev server)

**Delta from the common flow: set both `AGENT_BROWSER_ARGS` and
`AGENT_BROWSER_IGNORE_HTTPS_ERRORS` before the daemon launches.**

Two failures are reproducible on a fresh Ubuntu x86 box. Both are verified, with the cause and
remedy below.

### Fix 1 — `No usable sandbox!` (AppArmor restricts unprivileged user namespaces)

**Symptom:** the browser fails to launch and the logs / `doctor` "Launch test" show
`No usable sandbox!`.

**Cause:** Ubuntu **23.10 and newer** ship an AppArmor profile that restricts **unprivileged user
namespaces**, which Chrome's sandbox relies on. Without that capability, Chrome refuses to start.

**Remedy:** disable Chrome's sandbox by passing `--no-sandbox` via `AGENT_BROWSER_ARGS` **before
the daemon launches**:

```bash
export AGENT_BROWSER_ARGS="--no-sandbox"
```

### Fix 2 — `net::ERR_CERT_AUTHORITY_INVALID` (self-signed dev cert)

**Symptom:** the page fails to load and shows `net::ERR_CERT_AUTHORITY_INVALID`; the screenshot is
blank or shows the certificate-error interstitial.

**Cause:** `https://stevie.localhost:3443` is served with a **self-signed development
certificate** that Chrome does not trust by default.

**Remedy:** tell the browser to ignore HTTPS errors **before the daemon launches**:

```bash
export AGENT_BROWSER_IGNORE_HTTPS_ERRORS=1
```

### Putting it together

```bash
agent-browser install

# Stop any stale daemon so it re-reads the env (see caveat above).
agent-browser close --all
kill "$(pgrep -f 'agent-browser.*daemon')" 2>/dev/null || true

# Both fixes must be exported BEFORE the daemon launches.
export AGENT_BROWSER_ARGS="--no-sandbox"
export AGENT_BROWSER_IGNORE_HTTPS_ERRORS=1

agent-browser open https://stevie.localhost:3443
agent-browser screenshot --out dispatch-board.png
agent-browser doctor   # "Launch test" should pass
```

**End state:** with both variables set and the daemon restarted, `doctor` "Launch test" passes
and the screenshot is a non-blank dispatch board.

---

## Platform: Coder sandbox (Linux ARM / arm64)

**Delta from the common flow: the same two env-var fixes as Linux x86, plus an `arm64`
Chrome-binary decision.**

The Coder sandbox is Linux, so it has the same two failure modes as Linux x86. Start by applying
**both** Linux x86 fixes:

```bash
export AGENT_BROWSER_ARGS="--no-sandbox"
export AGENT_BROWSER_IGNORE_HTTPS_ERRORS=1
```

(and restart any stale daemon — see the caveat above).

### The arm64 Chrome-binary delta

The remaining `arm64`-specific question is **which Chrome binary to drive**: does
`agent-browser install` provide an `arm64` Chrome-for-Testing build, or must
`AGENT_BROWSER_EXECUTABLE_PATH` point at a system Chromium?

**Answer / verification procedure.** Run `agent-browser doctor` first and read the "Launch test"
line — it is the authoritative check:

1. **If `agent-browser install` supplied a working `arm64` build**, then after the two env-var
   fixes above, `doctor` "Launch test" **passes** with no executable override. This is the
   preferred path — use it and stop here.

2. **If `doctor` "Launch test" fails** because the bundled Chrome for Testing 149 build has **no
   `arm64` download** (Chrome for Testing has historically not published Linux `arm64` binaries),
   point `agent-browser` at an apt-installed system Chromium instead:

   ```bash
   sudo apt-get update && sudo apt-get install -y chromium-browser
   # Confirm the path your distro installs to — candidates:
   export AGENT_BROWSER_EXECUTABLE_PATH=/usr/bin/chromium-browser   # Ubuntu/Debian deb
   # or, if installed via snap / a different package:
   #   export AGENT_BROWSER_EXECUTABLE_PATH=/usr/bin/chromium
   #   export AGENT_BROWSER_EXECUTABLE_PATH=/snap/bin/chromium
   ```

   Then restart the daemon (the executable path, like the other variables, is read only at daemon
   launch) and re-check:

   ```bash
   agent-browser close --all
   kill "$(pgrep -f 'agent-browser.*daemon')" 2>/dev/null || true
   export AGENT_BROWSER_ARGS="--no-sandbox"
   export AGENT_BROWSER_IGNORE_HTTPS_ERRORS=1
   export AGENT_BROWSER_EXECUTABLE_PATH=/usr/bin/chromium-browser
   agent-browser open https://stevie.localhost:3443
   agent-browser doctor   # "Launch test" should now pass
   ```

> **Concrete guidance:** prefer the bundled build (path 1). The two candidate
> `AGENT_BROWSER_EXECUTABLE_PATH` values above (`/usr/bin/chromium-browser` and `/usr/bin/chromium`
> or `/snap/bin/chromium`) are the labeled `arm64` delta to fall back to, and `agent-browser
> doctor` "Launch test" is the single check that confirms which path your sandbox needs.

### Putting it together

```bash
agent-browser install

agent-browser close --all
kill "$(pgrep -f 'agent-browser.*daemon')" 2>/dev/null || true

export AGENT_BROWSER_ARGS="--no-sandbox"
export AGENT_BROWSER_IGNORE_HTTPS_ERRORS=1
# Only if the bundled arm64 build is unavailable (doctor "Launch test" fails):
#   export AGENT_BROWSER_EXECUTABLE_PATH=/usr/bin/chromium-browser

agent-browser open https://stevie.localhost:3443
agent-browser screenshot --out dispatch-board.png
agent-browser doctor   # "Launch test" should pass
```

**End state:** `doctor` "Launch test" passes and the screenshot is a non-blank dispatch board —
either via the bundled `arm64` Chrome for Testing build, or via a system Chromium pointed to by
`AGENT_BROWSER_EXECUTABLE_PATH` (the explicitly labeled `arm64` delta).

---

## Quick reference

| Platform | `--no-sandbox` | `IGNORE_HTTPS_ERRORS=1` | Custom executable |
| --- | --- | --- | --- |
| macOS | not needed | only if cert untrusted | not needed |
| Linux x86 | **required** | **required** | not needed |
| Coder arm64 | **required** | **required** | only if bundled arm64 build is missing (`doctor` "Launch test" decides) |

Remember: any `AGENT_BROWSER_*` change requires a **daemon restart**
(`agent-browser close --all` → kill daemon pid → re-export → `agent-browser open`), and
`agent-browser doctor` "Launch test" is the pass/fail check after every change.
