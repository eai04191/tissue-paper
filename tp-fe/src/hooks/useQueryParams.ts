export function useQueryParams() {
    if (typeof window === "undefined") return {};

    const params = new URLSearchParams(window.location.search);

    // tags パラメータを配列に変換
    const tags =
        params
            .get("tags")
            ?.split(/[+\s]+/)
            .filter(Boolean) || [];

    return {
        tags,
        link: params.get("link") || "",
        note: params.get("note") || "",
    };
}
