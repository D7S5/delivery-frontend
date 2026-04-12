import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStores } from "../../src/api/storeApi";
import PageLayout from "../components/layout/PageLayout";

function StoreListPage() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const result = await getStores();
        setStores(result || []);
      } catch (error) {
        alert(error.response?.data?.message || "가게 목록 조회 실패");
      }
    };

    fetchStores();
  }, []);

  return (
    <PageLayout
      eyebrow="Marketplace"
      title="주문 가능한 가게를 한눈에 확인하세요"
      description="현재 등록된 매장을 둘러보고 최소 주문 금액과 기본 정보를 빠르게 비교할 수 있습니다."
    >
      <section className="hero-grid">
        <article className="hero-panel hero-copy">
          <span className="eyebrow-chip">Live Stores</span>
          <h2>도메인 흐름은 유지하고, 화면 구조는 더 또렷하게 정리했습니다.</h2>
          <p>
            백엔드 도메인에 맞춰 매장, 주문, 결제, 라이더 화면을 같은 톤으로 정리했습니다.
            가장 자주 쓰는 매장 탐색 화면부터 카드 형태로 읽기 쉽게 구성했습니다.
          </p>
        </article>

        <aside className="stats-grid">
          <div className="stat-card">
            <strong>{stores.length}</strong>
            <span>등록된 매장 수</span>
          </div>
          <div className="stat-card">
            <strong>{stores.length ? "바로 주문 가능" : "매장 없음"}</strong>
            <span>사용자 진입 상태</span>
          </div>
        </aside>
      </section>

      {stores.length === 0 ? (
        <section className="empty-state">
          <strong>등록된 가게가 없습니다.</strong>
          <p>먼저 가게를 등록한 뒤 목록에서 상세 페이지로 이동할 수 있습니다.</p>
        </section>
      ) : (
        <section className="store-grid">
          {stores.map((store) => (
            <Link className="store-card-link" key={store.id} to={`/stores/${store.id}`}>
              <span className="tag">Store #{store.id}</span>
              <h3>{store.name}</h3>
              <p>최소 주문 금액 {Number(store.minOrderAmount).toLocaleString()}원부터 주문할 수 있습니다.</p>
            </Link>
          ))}
        </section>
      )}
    </PageLayout>
  );
}

export default StoreListPage;
