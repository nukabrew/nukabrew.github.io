/* ════════════════════════════════════════
   ★ APPS 데이터 — 앱 추가/삭제는 여기만 수정
   ════════════════════════════════════════
   필드 설명:
     tag  : 카드 상단 뱃지 텍스트 (예: 'Android App')
     title: 카드 제목 (한국어)
     sub1 : 영문 슬로건 (타이틀 아래 중간 크기)
     sub  : 영문 부제목 (가장 작은 크기)
     img  : 이미지 경로 (assets/images/ 기준)
     link : 카드 클릭 시 이동할 URL
════════════════════════════════════════ */
const APPS_DATA = [
    { tag: 'Android App', title: '총무노트', sub1: 'SPLIT THE BILL, KEEP THE CHILL.', sub: 'No more math, just more memories.', img: 'assets/images/port-01.jpg', link: '/pages/chunmu.html' },
    { tag: 'Android App', title: '돈쭐장부', sub1: 'Who Owes You?',                  sub: 'Never forget a single loan again..',  img: 'assets/images/port-02.jpg', link: '/pages/donzjul.html' },
    { tag: 'Android App', title: '네임픽',   sub1: 'PICK THE NAME',                  sub: 'Stop thinking, start clicking.',     img: 'assets/images/port-03.jpg', link: '/pages/namepick.html' },
    { tag: 'Android App', title: '프로젝트<br>이름 04', sub1: '', sub: 'PROJECT NAME 04', img: 'assets/images/port-04.jpg', link: '#' },
    { tag: 'Android App', title: '프로젝트<br>이름 05', sub1: '', sub: 'PROJECT NAME 05', img: 'assets/images/port-05.jpg', link: '#' },
    { tag: 'Android App', title: '프로젝트<br>이름 06', sub1: '', sub: 'PROJECT NAME 06', img: 'assets/images/port-06.jpg', link: '#' },
];

/* ════════════════════════════════════════
   ★ DESIGN 데이터 — 이미지 추가/삭제는 여기만 수정
   ════════════════════════════════════════
   필드 설명:
     src : 이미지 경로 (assets/images/ 기준)
     alt : 이미지 대체 텍스트
════════════════════════════════════════ */
const DESIGN_DATA = [
    { src: 'assets/images/design-01.png', alt: '총무노트' },
    { src: 'assets/images/design-02.png', alt: '돈쭐장부' },
    { src: 'assets/images/design-03.jpg', alt: '네임픽' },
    { src: 'assets/images/design-04.jpg', alt: 'Design 04' },
    { src: 'assets/images/design-05.jpg', alt: 'Design 05' },
    { src: 'assets/images/design-06.jpg', alt: 'Design 06' },
    { src: 'assets/images/design-07.jpg', alt: 'Design 07' },
    { src: 'assets/images/design-08.jpg', alt: 'Design 08' },
];