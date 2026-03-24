const GRAPHQL_URL = "https://ziona-api-staging.onrender.com/graphql/";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function graphqlRequest(
  query: string,
  variables?: any,
  token?: string,
  retries = 1 // 🔥 retry once for cold starts
) {
  if (!query) {
    console.error("GraphQL Error: Query is empty");
    throw new Error("GraphQL query is empty");
  }

  const finalPayload = {
    query: String(query),
    variables: variables ?? {},
  };

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("GRAPHQL REQUEST");
  console.log("URL:", GRAPHQL_URL);
  console.log("Query:", query);
  console.log("Variables:", variables ?? {});
  console.log("Token Present:", !!token);
  console.log("FINAL PAYLOAD SENT:", JSON.stringify(finalPayload));
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  let res: Response;

  try {
    res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(finalPayload),
    });
  } catch (err) {
    console.error("GraphQL Network Error:", err);

    if (retries > 0) {
      console.log("Retrying due to network error...");
      await sleep(1000);
      return graphqlRequest(query, variables, token, retries - 1);
    }

    throw new Error("Network request failed");
  }

  const text = await res.text();

  console.log("RAW RESPONSE TEXT:", text);

  /* =========================
     EMPTY RESPONSE HANDLING
  ========================= */

  if (!text || text.trim() === "") {
    console.error("Empty response from server");

    if (retries > 0) {
      console.log("Retrying due to empty response...");
      await sleep(1000);
      return graphqlRequest(query, variables, token, retries - 1);
    }

    throw new Error("Empty response from server");
  }

  /* =========================
     NON-JSON (HTML / ERROR PAGE)
  ========================= */

  if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
    console.error("Server returned HTML instead of JSON");

    if (retries > 0) {
      console.log("Retrying due to HTML response...");
      await sleep(1000);
      return graphqlRequest(query, variables, token, retries - 1);
    }

    throw new Error("Server error (HTML response)");
  }

  let json: any;

  try {
    json = JSON.parse(text);
  } catch {
    console.error("GraphQL Invalid JSON Response:", text);

    if (retries > 0) {
      console.log("Retrying due to invalid JSON...");
      await sleep(1000);
      return graphqlRequest(query, variables, token, retries - 1);
    }

    throw new Error("Invalid JSON response from server");
  }

  console.log("GRAPHQL RESPONSE STATUS:", res.status);
  console.log("GRAPHQL RESPONSE BODY:", json);

  /* =========================
     HTTP ERROR
  ========================= */

  if (!res.ok) {
    console.error("GraphQL HTTP Error:", res.status);
    console.error("Response:", json);

    throw new Error(`Network error: ${res.status}`);
  }

  /* =========================
     GRAPHQL ERROR
  ========================= */

  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error(json.errors[0]?.message || "GraphQL Error");
  }

  if (!json.data) {
    console.warn("GraphQL Warning: No data returned");
  }

  return json.data;
}