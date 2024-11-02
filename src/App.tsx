import { useState } from "react";
import "./App.css";

/**
 * usePostData カスタムフック
 *
 * @returns {Object} - フックの戻り値
 * @returns {any} response - サーバーからのレスポンスデータ
 * @returns {any} error - エラー情報
 * @returns {boolean} loading - ローディング状態
 * @returns {Function} postData - データをPOSTする関数
 */
const usePostData = () => {
  const [response, setResponse] = useState<any>(null as any);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /**
   * データをPOSTする関数
   *
   * @param {any} data - POSTするデータ
   * @returns {Promise<void>}
   */
  const postData = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://varieties-asian-roles-weighted.trycloudflare.com/api/v1/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        throw new Error("POSTリクエストに失敗しました");
      }
      const result = await res.json();
      setResponse(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, postData };
};

function App() {
  // response, error, loading は state
  // そのため、これらが更新されるとコンポーネントは再レンダリングされる
  const { response, error, loading, postData } = usePostData();

  // ユーザー入力のpromptを保存
  const [prompt, setPrompt] = useState("");

  // ユーザー入力のpromptをstateに保存する処理
  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  // stateに保存された値を使って、koboldcppにリクエストな投げる処理
  const handleSubmit = () => {
    const requestJson = {
      prompt: prompt,
    };
    postData(requestJson);
  };

  return (
    <>
      <div>
        <textarea
          value={prompt}
          onChange={handleInputChange}
          placeholder="Enter your prompt here"
        />
        <button onClick={handleSubmit}>Submit</button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {response && <p>Response: {response.results[0].text}</p>}
      </div>
    </>
  );
}

export default App;
