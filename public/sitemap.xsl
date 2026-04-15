<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Matungulu Girls Senior School | Complete Sitemap</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="description" content="Organized sitemap for Matungulu Girls Senior School - all pages, priorities, and update frequencies"/>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #f5f0e8 0%, #e8e0d4 100%);
            padding: 2rem 1.5rem;
            min-height: 100vh;
          }

          .container {
            max-width: 1400px;
            margin: 0 auto;
          }

          /* Header Section */
          .header-section {
            background: linear-gradient(135deg, #2c5a2e 0%, #1e3a20 100%);
            border-radius: 28px;
            padding: 2rem 2rem;
            margin-bottom: 2.5rem;
            color: white;
            box-shadow: 0 20px 35px -10px rgba(0,0,0,0.2);
          }

          .school-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .title-badge h1 {
            font-size: 2.2rem;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 0.5rem;
          }

          .title-badge p {
            opacity: 0.9;
            font-size: 1rem;
          }

          .stats-card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(8px);
            padding: 0.8rem 1.8rem;
            border-radius: 60px;
            text-align: center;
          }

          .stats-number {
            font-size: 2.2rem;
            font-weight: 800;
            line-height: 1;
          }

          .stats-label {
            font-size: 0.8rem;
            opacity: 0.85;
          }

          .last-update {
            margin-top: 1.2rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255,255,255,0.2);
            font-size: 0.85rem;
          }

          /* Section Navigation */
          .section-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            margin-bottom: 2rem;
            justify-content: center;
          }

          .nav-btn {
            background: white;
            border: none;
            padding: 0.6rem 1.3rem;
            border-radius: 40px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            color: #2c5a2e;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          }

          .nav-btn:hover {
            background: #2c5a2e;
            color: white;
            transform: translateY(-2px);
        }

          /* Category Grid */
          .category-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
            gap: 1.8rem;
            margin-bottom: 2.5rem;
          }

          /* Category Cards */
          .category-card {
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08);
            transition: transform 0.2s, box-shadow 0.2s;
          }

          .category-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 30px -10px rgba(0,0,0,0.12);
          }

          .card-header {
            padding: 1.2rem 1.5rem;
            background: #fef9f0;
            border-bottom: 3px solid;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .card-header .icon {
            font-size: 1.8rem;
          }

          .card-header h2 {
            font-size: 1.4rem;
            font-weight: 700;
            color: #2d3e2a;
          }

          .card-header .count {
            margin-left: auto;
            background: #e8ddce;
            padding: 0.2rem 0.7rem;
            border-radius: 40px;
            font-size: 0.75rem;
            font-weight: bold;
            color: #5a3e1f;
          }

          /* URL Items */
          .url-list {
            padding: 0.8rem 1rem 1.2rem 1.2rem;
            display: flex;
            flex-direction: column;
            gap: 0.9rem;
          }

          .url-item {
            border-left: 3px solid #d4bc8a;
            padding-left: 1rem;
            transition: all 0.1s;
          }

          .url-title {
            display: flex;
            align-items: baseline;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-bottom: 0.3rem;
          }

          .url-name {
            font-weight: 700;
            color: #2c5a2e;
            font-size: 0.95rem;
            word-break: break-word;
          }

          .url-priority {
            font-size: 0.7rem;
            background: #eef2e6;
            padding: 0.2rem 0.5rem;
            border-radius: 20px;
            color: #5a6b3e;
          }

          .url-link {
            font-size: 0.7rem;
            font-family: 'SF Mono', 'Fira Code', monospace;
            color: #8b7a62;
            word-break: break-all;
            margin-bottom: 0.3rem;
          }

          .url-link a {
            color: #6b5a42;
            text-decoration: none;
          }

          .url-link a:hover {
            text-decoration: underline;
            color: #2c5a2e;
          }

          .url-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.65rem;
            color: #9b8a70;
            margin-top: 0.2rem;
          }

          .changefreq {
            background: #f0ebe2;
            padding: 0.1rem 0.5rem;
            border-radius: 12px;
          }

          /* Footer */
          .footer-note {
            text-align: center;
            padding: 1.5rem;
            background: white;
            border-radius: 20px;
            color: #6b5a42;
            font-size: 0.85rem;
            margin-top: 1rem;
          }

          hr {
            margin: 0.5rem 0;
            border-color: #e6ddcf;
          }

          @media (max-width: 768px) {
            body { padding: 1rem; }
            .header-section { padding: 1.2rem; }
            .title-badge h1 { font-size: 1.6rem; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header-section">
            <div class="school-header">
              <div class="title-badge">
                <h1>🎓 Matungulu Girls Senior School</h1>
                <p>Complete Website Sitemap | Organized by Category</p>
              </div>
              <div class="stats-card">
                <div class="stats-number">
                  <xsl:value-of select="count(urlset/url)"/>
                </div>
                <div class="stats-label">Total Pages</div>
              </div>
            </div>
            <div class="last-update">
              📅 Last site update: <xsl:value-of select="urlset/url[1]/lastmod"/>
            </div>
          </div>

          <!-- Category Grouping Logic -->
          <xsl:variable name="homepage" select="urlset/url[contains(loc, 'vercel.app/') and not(contains(loc, '/pages/')) and not(contains(loc, '/about')) and not(contains(loc, 'admissions')) and not(contains(loc, 'apply')) and not(contains(loc, 'guidance')) and not(contains(loc, 'career')) and not(contains(loc, 'events')) and not(contains(loc, 'gallery')) and not(contains(loc, 'staff')) and not(contains(loc, 'portal')) and not(contains(loc, 'policy')) and not(contains(loc, 'contact')) and not(contains(loc, 'login')) and not(contains(loc, 'dashboard'))]"/>
          
          <xsl:variable name="aboutUrls" select="urlset/url[contains(loc, 'AboutUs') or contains(loc, 'about') or contains(loc, 'mission') or contains(loc, 'history')]"/>
          <xsl:variable name="admissionsUrls" select="urlset/url[contains(loc, 'admissions') or contains(loc, 'apply-for-admissions') or contains(loc, 'apply-now') or contains(loc, 'fees') or contains(loc, 'scholarship')]"/>
          <xsl:variable name="supportUrls" select="urlset/url[contains(loc, 'Guidance') or contains(loc, 'Coucelling') or contains(loc, 'careers')]"/>
          <xsl:variable name="newsUrls" select="urlset/url[contains(loc, 'eventsandnews') or contains(loc, 'news') or contains(loc, 'gallery')]"/>
          <xsl:variable name="communityUrls" select="urlset/url[contains(loc, 'SchoolTeam') or contains(loc, 'staff') or contains(loc, 'alumni')]"/>
          <xsl:variable name="portalUrls" select="urlset/url[contains(loc, 'StudentPortal') or contains(loc, 'portal')]"/>
          <xsl:variable name="policyUrls" select="urlset/url[contains(loc, 'OurSchoolpolicies') or contains(loc, 'policy') or contains(loc, 'terms')]"/>
          <xsl:variable name="contactUrls" select="urlset/url[contains(loc, 'contact')]"/>
          <xsl:variable name="adminUrls" select="urlset/url[contains(loc, 'adminLogin') or contains(loc, 'MainDashboard') or contains(loc, 'dashboard') or contains(loc, 'admin')]"/>

          <div class="category-grid">
            
            <!-- 1. HOMEPAGE -->
            <xsl:if test="count($homepage) > 0">
              <div class="category-card">
                <div class="card-header" style="border-bottom-color: #2c5a2e;">
                  <span class="icon">🏠</span>
                  <h2>Home & Brand</h2>
                  <span class="count"><xsl:value-of select="count($homepage)"/></span>
                </div>
                <div class="url-list">
                  <xsl:for-each select="$homepage">
                    <div class="url-item">
                      <div class="url-title">
                        <span class="url-name">Main Entrance</span>
                        <span class="url-priority">Priority: <xsl:value-of select="priority"/></span>
                      </div>
                      <div class="url-link">
                        <a href="{loc}" target="_blank"><xsl:value-of select="loc"/></a>
                      </div>
                      <div class="url-meta">
                        <span>📅 <xsl:value-of select="lastmod"/></span>
                        <span class="changefreq">🔄 <xsl:value-of select="changefreq"/></span>
                      </div>
                    </div>
                  </xsl:for-each>
                </div>
              </div>
            </xsl:if>

            <!-- 2. ABOUT SECTION -->
            <xsl:if test="count($aboutUrls) > 0">
              <div class="category-card">
                <div class="card-header" style="border-bottom-color: #4a7c59;">
                  <span class="icon">📖</span>
                  <h2>About Us</h2>
                  <span class="count"><xsl:value-of select="count($aboutUrls)"/></span>
                </div>
                <div class="url-list">
                  <xsl:for-each select="$aboutUrls">
                    <div class="url-item">
                      <div class="url-title">
                        <span class="url-name">
                          <xsl:choose>
                            <xsl:when test="contains(loc, 'AboutUs')">School Profile</xsl:when>
                            <xsl:otherwise>About Page</xsl:otherwise>
                          </xsl:choose>
                        </span>
                        <span class="url-priority">Priority: <xsl:value-of select="priority"/></span>
                      </div>
                      <div class="url-link"><a href="{loc}" target="_blank"><xsl:value-of select="loc"/></a></div>
                      <div class="url-meta"><span>📅 <xsl:value-of select="lastmod"/></span><span class="changefreq">🔄 <xsl:value-of select="changefreq"/></span></div>
                    </div>
                  </xsl:for-each>
                </div>
              </div>
            </xsl:if>

            <!-- 3. ADMISSIONS -->
            <xsl:if test="count($admissionsUrls) > 0">
              <div class="category-card">
                <div class="card-header" style="border-bottom-color: #c9a03d;">
                  <span class="icon">📝</span>
                  <h2>Admissions</h2>
                  <span class="count"><xsl:value-of select="count($admissionsUrls)"/></span>
                </div>
                <div class="url-list">
                  <xsl:for-each select="$admissionsUrls">
                    <div class="url-item">
                      <div class="url-title">
                        <span class="url-name">
                          <xsl:choose>
                            <xsl:when test="contains(loc, 'admissions') and not(contains(loc, 'apply'))">Admissions Info</xsl:when>
                            <xsl:when test="contains(loc, 'apply')">Application Form</xsl:when>
                            <xsl:otherwise>Admissions Page</xsl:otherwise>
                          </xsl:choose>
                        </span>
                        <span class="url-priority">Priority: <xsl:value-of select="priority"/></span>
                      </div>
                      <div class="url-link"><a href="{loc}" target="_blank"><xsl:value-of select="loc"/></a></div>
                      <div class="url-meta"><span>📅 <xsl:value-of select="lastmod"/></span><span class="changefreq">🔄 <xsl:value-of select="changefreq"/></span></div>
                    </div>
                  </xsl:for-each>
                </div>
              </div>
            </xsl:if>

            <!-- 4. STUDENT SUPPORT & CAREER -->
            <xsl:if test="count($supportUrls) > 0">
              <div class="category-card">
                <div class="card-header" style="border-bottom-color: #5f7f5c;">
                  <span class="icon">🤝</span>
                  <h2>Guidance & Careers</h2>
                  <span class="count"><xsl:value-of select="count($supportUrls)"/></span>
                </div>
                <div class="url-list">
                  <xsl:for-each select="$supportUrls">
                    <div class="url-item">
                      <div class="url-title">
                        <span class="url-name">
                          <xsl:choose>
                            <xsl:when test="contains(loc, 'Guidance')">Counselling Dept</xsl:when>
                            <xsl:when test="contains(loc, 'careers')">Career Opportunities</xsl:when>
                            <xsl:otherwise>Support Services</xsl:otherwise>
                          </xsl:choose>
                        </span>
                        <span class="url-priority">Priority: <xsl:value-of select="priority"/></span>
                      </div>
                      <div class="url-link"><a href="{loc}" target="_blank"><xsl:value-of select="loc"/></a></div>
                      <div class="url-meta"><span>📅 <xsl:value-of select="lastmod"/></span><span class="changefreq">🔄 <xsl:value-of select="changefreq"/></span></div>
                    </div>
                  </xsl:for-each>
                </div>
              </div>
            </xsl:if>

            <!-- 5. NEWS, EVENTS & GALLERY -->
            <xsl:if test="count($newsUrls) > 0">
              <div class="category-card">
                <div class="card-header" style="border-bottom-color: #b8865b;">
                  <span class="icon">📰</span>
                  <h2>News & Media</h2>
                  <span class="count"><xsl:value-of select="count($newsUrls)"/></span>
                </div>
                <div class="url-list">
                  <xsl:for-each select="$newsUrls">
                    <div class="url-item">
                      <div class="url-title">
                        <span class="url-name">
                          <xsl:choose>
                            <xsl:when test="contains(loc, 'events')">Events & News</xsl:when>
                            <xsl:when test="contains(loc, 'gallery')">Photo Gallery</xsl:when>
                            <xsl:otherwise>Updates</xsl:otherwise>
                          </xsl:choose>
                        </span>
                        <span class="url-priority">Priority: <xsl:value-of select="priority"/></span>
                      </div>
                      <div class="url-link"><a href="{loc}" target="_blank"><xsl:value-of select="loc"/></a></div>
                      <div class="url-meta"><span>📅 <xsl:value-of select="lastmod"/></span><span class="changefreq">🔄 <xsl:value-of select="changefreq"/></span></div>
                    </div>
                  </xsl:for-each>
                </div>
              </div>
            </xsl:if>

            <!-- 6. SCHOOL COMMUNITY & STAFF -->
            <xsl:if test="count($communityUrls) > 0">
              <div class="category-card">
                <div class="card-header" style="border-bottom-color: #8b6b4a;">
                  <span class="icon">👥</span>
                  <h2>Staff & Community</h2>
                  <span class="count"><xsl:value-of select="count($communityUrls)"/></span>
                </div>
                <div class="url-list">
                  <xsl:for-each select="$communityUrls">
                    <div class="url-item">
                      <div class="url-title">
                        <span class="url-name">
                          <xsl:choose>
                            <xsl:when test="contains(loc, 'SchoolTeam')">Staff Profiles</xsl:when>
                            <xsl:otherwise>Team Directory</xsl:otherwise>
                          </xsl:choose>
                        </span>
                        <span class="url-priority">Priority: <xsl:value-of select="priority"/></span>
                      </div>
                      <div class="url-link"><a href="{loc}" target="_blank"><xsl:value-of select="loc"/></a></div>
                      <div class="url-meta"><span>📅 <xsl:value-of select="lastmod"/></span><span class="changefreq">🔄 <xsl:value-of select="changefreq"/></span></div>
                    </div>
                  </xsl:for-each>
                </div>
              </div>
            </xsl:if>

            <!-- 7. PORTALS -->
            <xsl:if test="count($portalUrls) > 0">
              <div class="category-card">
                <div class="card-header" style="border-bottom-color: #3f6a4a;">
                  <span class="icon">🔐</span>
                  <h2>Student Portal</h2>
                  <span class="count"><xsl:value-of select="count($portalUrls)"/></span>
                </div>
                <div class="url-list">
                  <xsl:for-each select="$portalUrls">
                    <div class="url-item">
                      <div class="url-title">
                        <span class="url-name">Portal Access</span>
                        <span class="url-priority">Priority: <xsl:value-of select="priority"/></span>
                      </div>
                      <div class="url-link"><a href="{loc}" target="_blank"><xsl:value-of select="loc"/></a></div>
                      <div class="url-meta"><span>📅 <xsl:value-of select="lastmod"/></span><span class="changefreq">🔄 <xsl:value-of select="changefreq"/></span></div>
                    </div>
                  </xsl:for-each>
                </div>
              </div>
            </xsl:if>

            <!-- 8. POLICIES & TERMS -->
            <xsl:if test="count($policyUrls) > 0">
              <div class="category-card">
                <div class="card-header" style="border-bottom-color: #9e7b56;">
                  <span class="icon">⚖️</span>
                  <h2>Policies & Privacy</h2>
                  <span class="count"><xsl:value-of select="count($policyUrls)"/></span>
                </div>
                <div class="url-list">
                  <xsl:for-each select="$policyUrls">
                    <div class="url-item">
                      <div class="url-title">
                        <span class="url-name">School Policies</span>
                        <span class="url-priority">Priority: <xsl:value-of select="priority"/></span>
                      </div>
                      <div class="url-link"><a href="{loc}" target="_blank"><xsl:value-of select="loc"/></a></div>
                      <div class="url-meta"><span>📅 <xsl:value-of select="lastmod"/></span><span class="changefreq">🔄 <xsl:value-of select="changefreq"/></span></div>
                    </div>
                  </xsl:for-each>
                </div>
              </div>
            </xsl:if>

            <!-- 9. CONTACT -->
            <xsl:if test="count($contactUrls) > 0">
              <div class="category-card">
                <div class="card-header" style="border-bottom-color: #c49a6c;">
                  <span class="icon">📍</span>
                  <h2>Contact</h2>
                  <span class="count"><xsl:value-of select="count($contactUrls)"/></span>
                </div>
                <div class="url-list">
                  <xsl:for-each select="$contactUrls">
                    <div class="url-item">
                      <div class="url-title">
                        <span class="url-name">Get in Touch</span>
                        <span class="url-priority">Priority: <xsl:value-of select="priority"/></span>
                      </div>
                      <div class="url-link"><a href="{loc}" target="_blank"><xsl:value-of select="loc"/></a></div>
                      <div class="url-meta"><span>📅 <xsl:value-of select="lastmod"/></span><span class="changefreq">🔄 <xsl:value-of select="changefreq"/></span></div>
                    </div>
                  </xsl:for-each>
                </div>
              </div>
            </xsl:if>

            <!-- 10. ADMIN / DASHBOARD -->
            <xsl:if test="count($adminUrls) > 0">
              <div class="category-card">
                <div class="card-header" style="border-bottom-color: #a06e42;">
                  <span class="icon">🛠️</span>
                  <h2>Administration</h2>
                  <span class="count"><xsl:value-of select="count($adminUrls)"/></span>
                </div>
                <div class="url-list">
                  <xsl:for-each select="$adminUrls">
                    <div class="url-item">
                      <div class="url-title">
                        <span class="url-name">
                          <xsl:choose>
                            <xsl:when test="contains(loc, 'adminLogin')">Admin Login</xsl:when>
                            <xsl:when test="contains(loc, 'Dashboard')">Dashboard</xsl:when>
                            <xsl:otherwise>Admin Area</xsl:otherwise>
                          </xsl:choose>
                        </span>
                        <span class="url-priority">Priority: <xsl:value-of select="priority"/></span>
                      </div>
                      <div class="url-link"><a href="{loc}" target="_blank"><xsl:value-of select="loc"/></a></div>
                      <div class="url-meta"><span>📅 <xsl:value-of select="lastmod"/></span><span class="changefreq">🔄 <xsl:value-of select="changefreq"/></span></div>
                    </div>
                  </xsl:for-each>
                </div>
              </div>
            </xsl:if>

          </div>

          <div class="footer-note">
            <p>✨ <strong>Matungulu Girls Senior School</strong> — Complete XML Sitemap | Organized for better user experience & SEO</p>
            <hr/>
            <p>📌 All URLs are live and indexed. Last full sitemap generation: <xsl:value-of select="urlset/url[1]/lastmod"/></p>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>