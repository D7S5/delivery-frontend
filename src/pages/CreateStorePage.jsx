import { useState } from "react";
import api from "../api/axios";
import { openPostcodePopup, getCoordsFromAddress } from "../utils/addressSearch";
import PageLayout from "../components/layout/PageLayout";

function CreateStorePage() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    detailAddress: "",
    zonecode: "",
    phoneNumber: "",
    minOrderAmount: "",
    storeLat: "",
    storeLng: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchAddress = async () => {
    try {
      const selected = await openPostcodePopup();
      const coords = await getCoordsFromAddress(selected.address);

      setForm((prev) => ({
        ...prev,
        zonecode: selected.zonecode,
        address: selected.address,
        storeLat: coords.lat,
        storeLng: coords.lng,
      }));
    } catch (error) {
      if (error.message !== "주소 검색이 취소되었습니다.") {
        alert(error.message || "주소 검색 실패");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!form.address) {
        alert("주소 검색을 먼저 해주세요.");
        return;
      }

      const payload = {
        name: form.name,
        address: form.detailAddress
          ? `${form.address} ${form.detailAddress}`.trim()
          : form.address,
        phoneNumber: form.phoneNumber,
        minOrderAmount: Number(form.minOrderAmount),
        storeLat: Number(form.storeLat),
        storeLng: Number(form.storeLng),
      };

      console.log("store payload =", payload);

      const response = await api.post("/api/stores", payload);
      alert(response.data?.message || "가게 등록 성공");
    } catch (error) {
      alert(error.response?.data?.message || "가게 등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      eyebrow="Owner Tools"
      title="새 가게 등록"
      description="주소 검색과 좌표 확인까지 한 화면에서 마치도록 구성했습니다."
      narrow
    >
      <section className="surface-card form-card">
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <label htmlFor="store-name">가게명</label>
            <input
              id="store-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="가게명을 입력하세요"
            />
          </div>

          <div className="field-row">
            <label htmlFor="store-zonecode">우편번호</label>
            <div className="field-row-inline">
              <input
                id="store-zonecode"
                name="zonecode"
                value={form.zonecode}
                readOnly
                placeholder="우편번호"
              />
              <button type="button" className="secondary" onClick={handleSearchAddress}>
                주소 검색
              </button>
            </div>
          </div>

          <div className="field-row">
            <label htmlFor="store-address">기본 주소</label>
            <input
              id="store-address"
              name="address"
              value={form.address}
              readOnly
              placeholder="주소 검색 버튼을 눌러 선택하세요"
            />
          </div>

          <div className="field-row">
            <label htmlFor="store-detail-address">상세 주소</label>
            <input
              id="store-detail-address"
              name="detailAddress"
              value={form.detailAddress}
              onChange={handleChange}
              placeholder="상세 주소를 입력하세요"
            />
          </div>

          <div className="form-grid">
            <div className="field-row">
              <label htmlFor="store-phone">전화번호</label>
              <input
                id="store-phone"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="전화번호를 입력하세요"
              />
            </div>

            <div className="field-row">
              <label htmlFor="min-order-amount">최소 주문 금액</label>
              <input
                id="min-order-amount"
                name="minOrderAmount"
                type="number"
                value={form.minOrderAmount}
                onChange={handleChange}
                placeholder="15000"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="field-row">
              <label htmlFor="store-lat">위도</label>
              <input id="store-lat" name="storeLat" value={form.storeLat} readOnly />
            </div>

            <div className="field-row">
              <label htmlFor="store-lng">경도</label>
              <input id="store-lng" name="storeLng" value={form.storeLng} readOnly />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "등록 중..." : "가게 등록"}
          </button>
        </form>
      </section>
    </PageLayout>
  );
}

export default CreateStorePage;
