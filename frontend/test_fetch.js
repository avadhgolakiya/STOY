async function run() {
  try {
    const res = await fetch("http://127.0.0.1:5001/api/products/6a36cbd0bdd1b23916c1cf3b", { cache: "no-store" });
    console.log(res.status, res.ok);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("ERROR", err);
  }
}
run();
