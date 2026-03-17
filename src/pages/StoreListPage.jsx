import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStores } from "../../src/api/storeApi";

function StoreListPage() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const result = await getStores();
        setStores(result.data || []);
      } catch (error) {
        alert(error.response?.data?.message || "가게 목록 조회 실패");
      }
    };

    fetchStores();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h1>가게 목록</h1>
      <ul>
        {stores.map((store) => (
          <li key={store.id}>
            <Link to={`/stores/${store.id}`}>
              {store.name} / 최소주문금액: {store.minOrderAmount}원
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StoreListPage;