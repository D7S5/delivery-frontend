export const openPostcodePopup = () => {
  return new Promise((resolve, reject) => {
    if (!window.daum || !window.daum.Postcode) {
      reject(new Error("카카오 우편번호 서비스가 로드되지 않았습니다."));
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        const roadAddress = data.roadAddress;
        const jibunAddress = data.jibunAddress;

        const address = roadAddress || jibunAddress;

        if (!address) {
          reject(new Error("선택한 주소가 없습니다."));
          return;
        }

        resolve({
          zonecode: data.zonecode,
          address,
          roadAddress,
          jibunAddress,
          buildingName: data.buildingName || "",
        });
      },
      onclose: (state) => {
        if (state === "FORCE_CLOSE") {
          reject(new Error("주소 검색이 취소되었습니다."));
        }
      },
    }).open();
  });
};

export const getCoordsFromAddress = (address) => {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      reject(new Error("카카오 지도 API가 로드되지 않았습니다."));
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK || !result.length) {
        reject(new Error("주소를 좌표로 변환하지 못했습니다."));
        return;
      }

      resolve({
        lat: Number(result[0].y),
        lng: Number(result[0].x),
      });
    });
  });
};