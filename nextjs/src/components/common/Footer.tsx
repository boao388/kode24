export default function Footer() {
  return (
    <footer id="footer">
      <div className="container">
        <h2 className="logo">
          <img src="/assets/images/img_logo.svg" alt="" />
        </h2>
        <div className="company-info">
          <ul>
            <li>
              <dl>
                <dt>주식회사</dt>
                <dd>KODE24</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>대표이사</dt>
                <dd>윤상민</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>E-mail</dt>
                <dd><a href="mailto:kode24@kode24.co.kr" className="mail hoverable">kode24@kode24.co.kr</a></dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>대표번호</dt>
                <dd><a href="tel:1555-2501" className="hoverable">1555-2501</a></dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>사업자등록번호</dt>
                <dd>697-86-03222</dd>
              </dl>
            </li>
          </ul>
        </div>
        <div className="contact-area">
          <ul>
            <li>
              <dl>
                <dt>고객센터</dt>
                <dd>
                  <a href="tel:1555-2501">1555-2501</a>
                  <span>영업시간 365일 24시간(무료)</span>
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>Location</dt>
                <dd><address>경기도 하남시 미사강변한강로 135,스카이폴리스 나동 905호</address></dd>
              </dl>
            </li>
          </ul>
        </div>
        <div className="sns-list">
          <ul>
            <li><a href="https://www.youtube.com/@%EC%BD%94%EB%93%9C24" target="_blank" className="hoverable"><img src="/assets/images/ico_youtube.png" alt="" /></a></li>
            <li><a href="https://blog.naver.com/numerous13288" target="_blank" className="hoverable"><img src="/assets/images/ico_blog.png" alt="" /></a></li>
            {/*<li><a href="javascript:;" target="_blank" className="hoverable"><img src="/assets/images/ico_instar.png" alt="" /></a></li>*/}
          </ul>
        </div>
        <p className="copyright">COPYRIGHT ⓒKODE24 2025. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  )
} 