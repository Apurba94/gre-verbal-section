/* Verbal Section Simulator: timed Verbal sections in the current GRE format, with an adaptive second section. */
(function () {
  'use strict';
  // Section 1: 12 questions in 18 minutes. Section 2: 15 questions in 23 minutes, harder if section 1 went well.
  const pools = (data) => ({
    tc: data.tc, se: data.se, args: data.arguments,
    rc: SK.passageItems(data.gre_reading).map((x) => Object.assign(x, { long: data.gre_reading.find((p) => p.id === x.group).length === 'long' })),
  });
  const build = (data, size, hard, seed) => {
    const r = SK.rng(seed), P = pools(data);
    const nTc = Math.round(size * 0.3), nSe = Math.round(size * 0.25), nArg = 1;
    const tcPool = hard ? P.tc.filter((x) => x.blanks.length >= 2) : P.tc.filter((x) => x.blanks.length <= 2);
    const rcPool = P.rc.filter((x) => (hard ? true : !x.long));
    const tc = SK.fromBank(r, tcPool, 'All', nTc), se = SK.fromBank(r, P.se, 'All', nSe), arg = SK.fromBank(r, P.args, 'All', nArg);
    let rc = SK.takeGroups(r, rcPool, size - tc.length - se.length - arg.length);
    rc = rc.slice(0, size - tc.length - se.length - arg.length);
    return tc.concat(se, arg, rc).map((x) => Object.assign(x, { topic: x.type === 'tc' ? 'Text completion' : x.type === 'se' ? 'Sentence equivalence' : x.passage && !x.group ? 'Argument' : x.group ? 'Reading' : 'Argument' }));
  };
  const App = {
    about: 'Take a full Verbal measure under test timing: a first section of 12 questions in 18 minutes, then a second of 15 questions in 23 minutes. As on the GRE, the second section is harder if you did well on the first. Questions come from the suite\'s original banks.',
    how: ['Find 45 quiet minutes and press **Start** in **Simulator**.', 'Inside a section you can skip, mark questions for review and go back, as on the test.', 'Afterwards, review your mistakes in the GRE Error Log app or repeat with new questions.',
      'Your raw score is shown. Official scaled scores (130 to 170) use ETS\'s own conversion, which this app does not guess.'],
    tabs: [
      { id: 'sim', label: 'Simulator', render(el, ctx) {
        const seed = SK.seedNow();
        const intro = () => {
          SK.clear(el);
          el.appendChild(SK.card('Verbal Reasoning: two sections', SK.table(['Section', 'Questions', 'Time'], [['1', '12', '18 minutes'], ['2 (adapts to section 1)', '15', '23 minutes']], false),
            SK.h('div', { style: { marginTop: '12px' } }, SK.btn('Start', () => SK.sectionRun(el, [
              { title: 'Verbal section 1', seconds: 18 * 60, items: build(ctx.data, 12, false, seed) },
              { title: 'Verbal section 2', seconds: 23 * 60, items: (res) => build(ctx.data, 15, res[0].correct >= 8, seed + 1), intro: '15 questions in 23 minutes. Its difficulty depends on how you did in section 1.' }],
            (res) => {
              SK.clear(el);
              const total = res.reduce((s, x) => s + x.correct, 0);
              el.appendChild(SK.card('Verbal results', SK.stats([['Section 1', res[0].correct + ' / 12'], ['Section 2', res[1].correct + ' / 15'], ['Total', total + ' / 27'], ['Second section', res[0].correct >= 8 ? 'Harder' : 'Easier']]),
                SK.h('p', { class: 'sk-muted', text: 'This is a raw score. It does not predict an official scaled score.' }), SK.btn('Take another', intro, 'ghost', { 'data-auto': 'once' })));
            }), '', { 'data-auto': 'once' }))));
        };
        intro();
      } },
    ],
    build,
    checks: {
      'sections have the right length and a mix of question types': (data, assert) => {
        for (let s = 1; s < 25; s++) {
          for (const [size, hard] of [[12, false], [15, true], [15, false]]) {
            const items = build(data, size, hard, s);
            assert.equal(items.length, size);
            assert.equal(new Set(items.map((x) => x.id)).size, size, 'no repeats');
            for (const t of ['tc', 'se']) assert.ok(items.some((x) => x.type === t), t);
            for (const it of items) assert.deepEqual(SK.validateItem(it), []);
          }
        }
      },
      'the harder second section uses only two- and three-blank completions': (data, assert) => {
        for (let s = 1; s < 10; s++) for (const it of build(data, 15, true, s)) if (it.type === 'tc') assert.ok(it.blanks.length >= 2);
      },
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = App; else SK.start(App);
})();
