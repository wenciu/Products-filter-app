async function fetchData() {
  try {
    const response = await fetch(
      "https://json.extendsclass.com/bin/92334a2296f1"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export { fetchData };
