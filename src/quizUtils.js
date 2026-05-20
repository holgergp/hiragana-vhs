export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getWrongOptions(correct, pool, count = 2) {
  const others = pool.filter((x) => x.rom !== correct.rom);
  return shuffle(others).slice(0, count);
}

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
