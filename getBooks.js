async function getBooks(url) {
  // read the json from our route/url
  console.log("getBooks");
  let rawData = await fetch(url);
  // unpack/deserialize the json int a javascript data structure
  let data = await rawData.json();
  // the same as: await (await fetch('./persons.json)')).json();
  return data;
}

export default getBooks;
