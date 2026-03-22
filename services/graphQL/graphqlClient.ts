const GRAPHQL_URL = "https://ziona-api-staging.onrender.com/graphql/";

export async function graphqlRequest(
  query: string,
  variables?: any,
  token?: string,
) {
  if (!query) {
    console.error("GraphQL Error: Query is empty");
    throw new Error("GraphQL query is empty");
  }

  // FORCE CLEAN PAYLOAD
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

  //  THIS IS THE IMPORTANT LOG
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
    throw new Error("Network request failed");
  }

  const text = await res.text();

  console.log("RAW RESPONSE TEXT:", text);

  let json: any;

  try {
    json = JSON.parse(text);
  } catch {
    console.error("GraphQL Invalid JSON Response:", text);
    throw new Error("Invalid JSON response from server");
  }

  console.log("GRAPHQL RESPONSE STATUS:", res.status);
  console.log("GRAPHQL RESPONSE BODY:", json);

  if (!res.ok) {
    console.error("GraphQL HTTP Error:", res.status);
    console.error("Response:", json);
    throw new Error(`Network error: ${res.status}`);
  }

  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error(json.errors[0]?.message || "GraphQL Error");
  }

  if (!json.data) {
    console.warn("GraphQL Warning: No data returned");
  }

  return json.data;
}
