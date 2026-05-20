/**
 * Fisher-Yates shuffle. Returns a new array; input is not mutated.
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Returns `count` distractors from `pool` that are not the `correct` answer.
 */
export function getWrongOptions(correct, pool, count = 2) {
  const others = pool.filter((x) => x.rom !== correct.rom);
  return shuffle(others).slice(0, count);
}

/**
 * Weighted random selection (roulette-wheel / cumulative method).
 *
 * Each item gets a base weight of 1 plus its recorded miss count.
 * Example with 3 items:
 *   item A: 0 misses → weight 1
 *   item B: 2 misses → weight 3
 *   item C: 0 misses → weight 1
 *   total  = 5
 *   → B has 3/5 chance, A and C each 1/5.
 *
 * @param {Array} pool      – items to choose from
 * @param {Object} weights  – map of key → number of misses (e.g. { "あ": 2 })
 * @param {Function} getKey – how to derive the map key from an item (default: item.char)
 */
export function pickWeighted(pool, weights, getKey = (item) => item.char) {
  const total = pool.reduce((sum, item) => sum + 1 + (weights[getKey(item)] || 0), 0);
  let rnd = Math.random() * total;
  for (const item of pool) {
    const w = 1 + (weights[getKey(item)] || 0);
    rnd -= w;
    if (rnd <= 0) return item;
  }
  return pool[pool.length - 1];
}
