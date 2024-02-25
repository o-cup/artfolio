export const PREFIX = `${process.env.PUBLIC_URL}/exhibitions`;

const exhibitionsData = {
  kr: [
  { 
    id: "01", 
    type: "단체전", 
    title: "2019 <제 18회 동강국제사진제>", 
    date: "2019/7/5 - 2019/9/29",
    location: "영월, 한국",
    posterUrl: `${PREFIX}/01/0_poster.png`,
    exhibitionPhotoCount: 7,

  },
  {
    id: "02",
    type: "개인전", 
    title: "Exhibition Title 02", 
    date: "2019/11/13 - 2020/1/30",
    location: "브뤼셀 한국문화원, 브뤼셀, 벨기에",
    posterUrl: `${PREFIX}/02/0_poster.jpeg`,
    exhibitionPhotoCount: 15
  },
  {
    id: "03",
    type: "개인전",
    title: "2019 한-벨 사진전 <STILL LIVES>",
    date: "2019/11/13 - 2020/1/30",
    location: "브뤼셀 한국문화원, 브뤼셀, 벨기에",
    posterUrl: `${PREFIX}/03/0_poster.png`,
    exhibitionPhotoCount: 16
  },
  { id: "04", 
  type: "단체전", 
  title: "<2020 아시아프 히든 아티스트 페스티벌>", 
  date: "2020/7/21 - 2020/8/16", 
  location: "홍익대학교 현대미술관, 서울, 한국",
 posterUrl: `${PREFIX}/04/0_poster.png`, exhibitionPhotoCount: 6},

  { id: "05", 
  type: "개인전", 
  title: "<보내야하는 사물들을 위한 정물, Vanity>", 
  date: "2020/8/16 - 2020/8/31", 
  location: "포토그랩스 291, 서울, 한국", 
  posterUrl: `${PREFIX}/05/0_poster.png`, exhibitionPhotoCount: 6 },
  { id: "06", type: "단체전", title: "<포스트 코로나시대의 미술>", date: "2020/9/29 - 2021/1/10", location: "오산시립미술관, 경기도, 한국", posterUrl: `${PREFIX}/06/0_poster.png`, exhibitionPhotoCount: 13},
  { id: "07", type: "단체전", title: "<2020 BIPF X LUMOS Portfolio Review 우수 포트폴리오 수상자전 (이질적 시간)>", date: "2021/1/16 - 2021/2/7", location: "아트스페이스 루모스, 대구, 한국", posterUrl: `${PREFIX}/07/0_poster.png`, exhibitionPhotoCount: 16},
  { id: "08", type: "단체전", title: "<제9회 자문밖문화축제 “걷고, 사랑하고, 예술하라” 자문 밖 연합전(곳곳)>", date: "2021/10/4 - 2021/10/17", location: "갤러리 세줄, 서울, 한국", posterUrl: `${PREFIX}/08/0_poster.png`, exhibitionPhotoCount: 3},
  { id: "09", type: "개인전", title: "<Baldwin 위의 정물>", date: "2023/5/1 - 2023/6/23", location: "반도카메라 라이카스토어, 서울, 한국", posterUrl: `${PREFIX}/09/0_poster.png`, exhibitionPhotoCount: 3},
  { id: "10", type: "개인전", title: "<보내야하는 사물들을 위한 정물, Mourning>", date: "2024/1/5 - 2024/1/22", location: "룩인사이드, 서울, 한국", posterUrl: `${PREFIX}/10/0_poster.jpeg`, exhibitionPhotoCount: 22},
],
en: []
}

export default exhibitionsData;
