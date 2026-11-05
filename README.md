# Verbal Section Simulator

Take timed Verbal sections in the current format: 12 questions in 18 minutes, then 15 in 23.

Part of the [GRE and TOEFL Study Suite](https://github.com/Apurba94/gre-toefl-study-suite): 100 free study apps for the GRE General Test and more. It works offline, as a Windows program or in the browser.

## Download and run

- **Windows:** download `Verbal Section Simulator.exe` from the [latest release](https://github.com/Apurba94/gre-verbal-section/releases/latest) and open it. Nothing to install. It opens in its own window and saves your progress in your user folder.
- **Browser:** open it online in the suite's web edition at https://gre-toefl-study-suite.vercel.app/apps/gre-verbal-section/ . Progress stays in that browser.
- **From source:** `python launcher.py` (Python 3.10 or later, no packages needed).

## What it does

Take a full Verbal measure under test timing: a first section of 12 questions in 18 minutes, then a second of 15 questions in 23 minutes. As on the GRE, the second section is harder if you did well on the first. Questions come from the suite's original banks.

Sections: Simulator, Progress, About.

## How to use it

1. Find 45 quiet minutes and press **Start** in **Simulator**.
2. Inside a section you can skip, mark questions for review and go back, as on the test.
3. Afterwards, review your mistakes in the GRE Error Log app or repeat with new questions.
4. Your raw score is shown. Official scaled scores (130 to 170) use ETS's own conversion, which this app does not guess.

## Good to know

- All questions, passages and definitions were written for this suite. None are official ETS questions. For official practice, use the materials on ets.org.
- It follows the GRE General Test as shortened in September 2023 and the TOEFL iBT as updated in January 2026. Formats change, so check ets.org before your test.
- Feedback on writing and speaking counts things a program can count honestly, such as length and linking words. It does not give an official score.
- Not endorsed by or affiliated with ETS. GRE and TOEFL are registered trademarks of ETS.

## For developers

The app is plain HTML and JavaScript in `web/`, run by a small Python launcher that serves it on 127.0.0.1 only and needs a secret token for saving. Tests: `node --test "tests/*.test.js"` (24 tests) and `python -m unittest discover -s tests`. Build the .exe with `python build_exe.py`.

Built with AI assistance (Claude Code). MIT licence. By JANIN A APURBA.
