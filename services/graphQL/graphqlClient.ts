import { useAuthStore } from "@/store/useAuthStore";

const GRAPHQL_URL = "https://ziona-api-staging.onrender.com/graphql/";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function graphqlRequest(
  query: string,
  variables?: any,
  retries = 1
) {
  if (!query) {
    console.error("GraphQL Error: Query is empty");
    throw new Error("GraphQL query is empty");
  }

  const store = useAuthStore.getState();
  const token = store.tokens?.accessToken;

  const finalPayload = {
    query: String(query),
    variables: variables ?? {},
  };

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("GRAPHQL REQUEST");
  console.log("Token Present:", !!token);
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
    if (retries > 0) {
      await sleep(1000);
      return graphqlRequest(query, variables, retries - 1);
    }
    throw new Error("Network request failed");
  }

  const text = await res.text();

  if (!text || text.trim() === "") {
    if (retries > 0) {
      await sleep(1000);
      return graphqlRequest(query, variables, retries - 1);
    }
    return null;
  }

  let json: any;

  try {
    json = JSON.parse(text);
  } catch {
    if (retries > 0) {
      await sleep(1000);
      return graphqlRequest(query, variables, retries - 1);
    }
    throw new Error("Invalid JSON response");
  }

  if (!res.ok) {
    throw new Error(`Network error: ${res.status}`);
  }

  if (json.errors) {
    console.warn("GraphQL Partial Errors:", json.errors);
  }

  return json.data;
}