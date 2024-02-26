export const PREFIX = `${process.env.PUBLIC_URL}/exhibitions`;

const exhibitionsData = {
  ko: [
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
    title: "<Baldwin 위의 정물>", 
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
en: [
    { 
    id: "01", 
    type: "group exhibition", 
    title: "2019 <18th Donggang International Photo Festival>", 
    date: "5/7/2019 - 29/9/2019",
    location: "Yeongwol, South Korea",
    posterUrl: `${PREFIX}/01/0_poster.png`,
    exhibitionPhotoCount: 7,

  },
  {
    id: "02",
    type: "solo exhibition", 
    title: "<Still Life with Baldwin>", 
    date: "3/9/2019 - 22/9/2019",
    location: "Space 291, Seoul, South Korea",
    posterUrl: `${PREFIX}/02/0_poster.jpeg`,
    exhibitionPhotoCount: 15
  },
  {
    id: "03",
    type: "group exhibition",
    title: "2019 <Korea-Belgium Photo Exhibition (STILL LIVES)>",
    date: "13/11/2019 - 30/1/2020",
    location: "Brussels Korean Cultural Center, Brussels, Belgium",
    posterUrl: `${PREFIX}/03/0_poster.png`,
    exhibitionPhotoCount: 16
  },
  { id: "04", 
  type: "group exhibition", 
  title: "<2020 ASYAAF & Hidden Artist Festival>", 
  date: "21/7/2020 - 16/8/2020", 
  location: "HOMA(Hongik Museum of Art), Seoul, Korea",
 posterUrl: `${PREFIX}/04/0_poster.png`, exhibitionPhotoCount: 6},

  { id: "05", 
  type: "solo exhibition", 
  title: "<Still Life for Things that Need a Goodbye, Vanity>", 
  date: "16/8/2020 - 31/8/2020", 
  location: "Lotte Avenuel Photographs 291 Gallery, Seoul, Korea ", 
  posterUrl: `${PREFIX}/05/0_poster.png`, exhibitionPhotoCount: 6 },
  { id: "06", type: "group exhibition", title: "<Contemporary Art in the Post-COVID-19 Era>", date: "29/9/2020 - 10/1/2021", location: "Osan Museum of Art, Gyeonggi, South Korea", posterUrl: `${PREFIX}/06/0_poster.png`, exhibitionPhotoCount: 13},
  { id: "07", type: "group exhibition", title: "<2020 BIPF X LUMOS Portfolio Review 우수 포트폴리오 수상자전 (이질적 시간)>", date: "16/1/2021 - 7/2/2021", location: "Art Space Lumos, Daegu, South Korea", posterUrl: `${PREFIX}/07/0_poster.png`, exhibitionPhotoCount: 16},
  { id: "08", type: "group exhibition", title: "<제9회 자문밖문화축제 “걷고, 사랑하고, 예술하라” 자문 밖 연합전(곳곳)>", date: "2021/10/4 - 2021/10/17", location: "갤러리 세줄, 서울, 한국", posterUrl: `${PREFIX}/08/0_poster.png`, exhibitionPhotoCount: 3},
  { id: "09", type: "solo exhibition", title: "2021 <The 9th Culture Festival \"Walk, Love, and Art\">", date: "4/10/2021 - 17/10/2021", location: "Gallery Sejul, Seoul, South Korea", posterUrl: `${PREFIX}/09/0_poster.png`, exhibitionPhotoCount: 3},
  { id: "10", type: "solo exhibition", title: "<Still Life for Things that Need a Goodbye, Mourning>", date: "5/1/2024 - 22/1/2024", location: "Gallery Look-in-side, Seoul, South Korea", posterUrl: `${PREFIX}/10/0_poster.jpeg`, exhibitionPhotoCount: 22},

]
}

export default exhibitionsData;
