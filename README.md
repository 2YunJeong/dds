# OpenDDS
OpenDDS의 Web Integration Service를 활용하여 만든 데이터 조회 프로젝트입니다.
---------------
## [개발 환경]
- Backend : Node.js 16.19.1
- Frontend : Vue.js 2.6.14
- OpenDDS : 3.23.1
- OpenDDS module for Node.js : 0.2.1
- VM : Ubuntu 18.04.6 LTS
---------------
## [개발 기간]
- 2023.05.1 ~ 2022.06.4
---------------
## [프로젝트 기능]
1. 클라이언트에서 데이터 요청 시 back-end의 dds publisher가 데이터 pub
2. pub은 DDS Domain으로 Topic write, sub은 해당 topic을 read
3. dds subscriber가 read한 데이터는 클라이언트로 push
4. 브라우저에서 push된 데이터 조회 가능
