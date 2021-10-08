webgl은 rasterization 엔진. 함수 쌍 형태로 코드를 제공하면 컴퓨터 gpu에서 실행됨.
- Vertex shader: 정점 위치 계산 
- Fragment shader: 현재 그려지는 primitive의 각 픽셀에 대한 색상 계산

상태를 설정하고 gl.drawArrays, gl.drawElements 호출하여 함수 쌍 실행 

셰이더가 데이터를 받을 수 있는 방법
1. Attribute & Buffer: 버퍼는 GPU에 업로드하는 2진 데이터 배열. attribte 버퍼에서 데이터를 가져오고 vertex shader에 제공하는 방법을 지정하는데 사용됨. 버퍼는 무작위로 접근할 수 없음. vertex shader가 지정한 횟수만큼 실행. 실행 될 때마다 지정된 버퍼에서 값을 가져와서 attribute에 할당.
2. Uniform: shader program을 실행하기 전에 설정하는 전역 변수
3. Texture: shader program에서 무작위로 접근할 수 있는 데이터 배열. 대부분은 이미지 데이터, 색상 이외의 것도 담을 수 있음
4. Varying: vertex shader가 fragment shader에 데이터를 넘기는 방법

clip space의 좌표와 색상 => 프로그래머의 역할은 이 2가지를 작성하는 것임

Clip space 좌표를 제공하는 vertex shader, 색상을 제공하는 fragment shader

Clip space 좌표는 캔버스 크기에 상관없이 항상 -1에서 +1까지

