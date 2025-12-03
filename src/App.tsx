import './App.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

function App() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [currentPostImages, setCurrentPostImages] = useState<string[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const openLightbox = (images: string[], index: number) => {
    setCurrentPostImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // Arrays com as imagens de cada post
  const post1Images = ['/gallery/post1-foto1.png', '/gallery/post1-foto2.png', '/gallery/post1-foto3.png']
  const post2Images = ['/gallery/post2-foto1.png', '/gallery/post2-foto2.png', '/gallery/post2-foto3.png']
  const post3Images = ['/gallery/post3-foto1.png', '/gallery/post3-foto2.png', '/gallery/post3-foto3.png']
  const post4Images = ['/gallery/post4-foto1.png', '/gallery/post4-foto2.png', '/gallery/post4-foto3.png']
  const post5Images = ['/gallery/post5-foto1.png', '/gallery/post5-foto2.png', '/gallery/post5-foto3.png']

  return (
    <div className="site" id="inicio">
      <nav className="navbar">
        <div className="container navbar-content">
          <img src="/logo-horizontal.svg" alt="Bruna Gomes" className="nav-logo" />
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <a href="#inicio" className="desktop-nav-link">Início</a>
            <a href="#profissional" className="desktop-nav-link">A Profissional</a>
            <a href="#sobre" className="desktop-nav-link">Sobre</a>
            <a href="#servicos" className="desktop-nav-link">Serviços</a>
            <a href="#localizacao" className="desktop-nav-link">Localização</a>
            <a href="#contato" className="nav-cta desktop-nav-link">Agendar Avaliação</a>

            <div className="mobile-menu-logo">
              <img src="/logo-horizontal.svg" alt="Bruna Gomes" />
              <button className="mobile-menu-close" onClick={closeMobileMenu} aria-label="Fechar menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <nav className="mobile-menu-nav">
              <a href="#inicio" onClick={closeMobileMenu}>Início</a>
              <a href="#profissional" onClick={closeMobileMenu}>A Profissional</a>
              <a href="#sobre" onClick={closeMobileMenu}>Sobre</a>
              <a href="#servicos" onClick={closeMobileMenu}>Serviços</a>
              <a href="#localizacao" onClick={closeMobileMenu}>Localização</a>
              <a href="#contato" onClick={closeMobileMenu}>Contato</a>
            </nav>

            <div className="mobile-menu-section">
              <span className="mobile-menu-section-title">Redes Sociais</span>
              <div className="mobile-menu-social">
                <a href="https://wa.me/5551999264181" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/brunagomesfisio/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="white" strokeWidth="2"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2"/>
                  </svg>
                </a>
                <a href="tel:+5551999264181" aria-label="Telefone">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="mobile-menu-section">
              <span className="mobile-menu-section-title">Informações</span>
              <div className="mobile-menu-contact">
                <div className="mobile-contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <strong>Medplex Eixo Norte</strong>
                    <p>Av. Assis Brasil, 2827 - Sala 1507</p>
                  </div>
                </div>

                <div className="mobile-contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <div>
                    <strong>Horário</strong>
                    <p>Seg a Sex: 07:00 - 20:00</p>
                  </div>
                </div>

                <div className="mobile-contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <div>
                    <strong>Telefone</strong>
                    <p><a href="tel:+5551999264181">(51) 99926-4181</a></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mobile-menu-cta-section">
              <div className="mobile-menu-cta">
                <a href="https://api.whatsapp.com/send/?phone=51999264181&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="mobile-cta-button">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Agendar Avaliação
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Pilates & Fisioterapia
              </h1>
              <p className="hero-subtitle">
                Atendimento personalizado e exclusivo • Zona Norte de Porto Alegre
              </p>
              <div className="hero-buttons">
                <a href="#contato" className="btn btn-primary">Agendar Avaliação</a>
                <a href="#servicos" className="btn btn-outline">Conhecer Serviços</a>
              </div>
            </div>
            <div className="hero-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <div className="feature-content">
                  <h3>Acolhedor</h3>
                  <p>Ambiente reservado e acolhedor</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="feature-content">
                  <h3>Personalizado</h3>
                  <p>Atendimento individual ou em dupla</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
                  </svg>
                </div>
                <div className="feature-content">
                  <h3>Estacionamento</h3>
                  <p>Estacionamento no local</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="profissional" className="professional">
        <div className="container">
          <div className="professional-grid">
            <div className="professional-image">
              <img src="/bruna2.png" alt="Bruna Gomes - Fisioterapeuta" />
            </div>
            <div className="professional-content">
              <span className="section-label">A Profissional</span>
              <h2>Bruna Gomes</h2>
              <p className="professional-title">Fisioterapeuta & Instrutora de Pilates</p>
              <p>
                Com formação em Fisioterapia,
                dedico-me a ajudar pessoas a alcançarem seus objetivos de saúde e bem-estar através
                de um atendimento personalizado e acolhedor.
              </p>
              <p>
                Minha abordagem integra técnicas de Pilates em aparelhos com tratamentos fisioterapêuticos,
                proporcionando resultados efetivos e duradouros. Cada sessão é planejada de forma individual,
                respeitando as necessidades e limitações de cada aluna.
              </p>
              <div className="professional-credentials">
                <div className="credential-item">
                  <span className="credential-icon">✓</span>
                  <span>Fisioterapeuta CREFITO</span>
                </div>
                <div className="credential-item">
                  <span className="credential-icon">✓</span>
                  <span>Instrutora de Pilates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <span className="section-label">Sobre</span>
              <h2>Local pensado para seu bem-estar físico e mental</h2>
              <p>
                Espaço na Zona Norte de Porto Alegre, próximo ao
                Shopping Wallig. Oferecemos Pilates em aparelhos e Fisioterapia com
                atendimento personalizado em um ambiente acolhedor e reservado.
              </p>
              <p>
                Nossa abordagem integra avaliação postural completa, exercícios terapêuticos
                e acompanhamento individualizado para cada objetivo específico. Venha nos
                conhecer, será um prazer atendê-la!
              </p>
              <div className="credentials">
                <div className="credential-item">
                  <span className="credential-icon">✓</span>
                  <span>Fisioterapeuta CREFITO</span>
                </div>
                <div className="credential-item">
                  <span className="credential-icon">✓</span>
                  <span>Instrutora de Pilates</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="/estudio.png" alt="Bruna Gomes - Pilates e Fisioterapia" />
            </div>
          </div>
        </div>
      </section>

      <section id="instagram" className="gallery">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Instagram</span>
            <h2>Acompanhe nosso dia a dia</h2>
            <p>Confira dicas, exercícios e novidades direto do nosso Instagram</p>
          </div>
          <div className="gallery-grid">
            {/* Post 1 - Com múltiplas fotos */}
            <div className="gallery-post">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="post-carousel"
              >
                <SwiperSlide>
                  <img
                    src="/gallery/post1-foto1.png"
                    alt="Studio Bruna Gomes"
                    onClick={() => openLightbox(post1Images, 0)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/gallery/post1-foto2.png"
                    alt="Studio Bruna Gomes"
                    onClick={() => openLightbox(post1Images, 1)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/gallery/post1-foto3.png"
                    alt="Studio Bruna Gomes"
                    onClick={() => openLightbox(post1Images, 2)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
              </Swiper>
            </div>

            {/* Post 2 - Com múltiplas fotos */}
            <div className="gallery-post">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="post-carousel"
              >
                <SwiperSlide>
                  <img
                    src="/gallery/post2-foto1.png"
                    alt="Pilates Aparelhos"
                    onClick={() => openLightbox(post2Images, 0)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/gallery/post2-foto2.png"
                    alt="Pilates Aparelhos"
                    onClick={() => openLightbox(post2Images, 1)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/gallery/post2-foto3.png"
                    alt="Pilates Aparelhos"
                    onClick={() => openLightbox(post2Images, 2)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
              </Swiper>
            </div>

            {/* Post 3 - Com múltiplas fotos */}
            <div className="gallery-post">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="post-carousel"
              >
                <SwiperSlide>
                  <img
                    src="/gallery/post3-foto1.png"
                    alt="Espaço do Studio"
                    onClick={() => openLightbox(post3Images, 0)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/gallery/post3-foto2.png"
                    alt="Espaço do Studio"
                    onClick={() => openLightbox(post3Images, 1)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/gallery/post3-foto3.png"
                    alt="Espaço do Studio"
                    onClick={() => openLightbox(post3Images, 2)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
              </Swiper>
            </div>

            {/* Post 4 - Com múltiplas fotos */}
            <div className="gallery-post">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="post-carousel"
              >
                <SwiperSlide>
                  <img
                    src="/gallery/post4-foto1.png"
                    alt="Atendimento Personalizado"
                    onClick={() => openLightbox(post4Images, 0)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/gallery/post4-foto2.png"
                    alt="Atendimento Personalizado"
                    onClick={() => openLightbox(post4Images, 1)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/gallery/post4-foto3.png"
                    alt="Atendimento Personalizado"
                    onClick={() => openLightbox(post4Images, 2)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
              </Swiper>
            </div>

            {/* Post 5 - Com múltiplas fotos */}
            <div className="gallery-post">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="post-carousel"
              >
                <SwiperSlide>
                  <img
                    src="/gallery/post5-foto1.png"
                    alt="Ambiente Acolhedor"
                    onClick={() => openLightbox(post5Images, 0)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/gallery/post5-foto2.png"
                    alt="Ambiente Acolhedor"
                    onClick={() => openLightbox(post5Images, 1)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/gallery/post5-foto3.png"
                    alt="Ambiente Acolhedor"
                    onClick={() => openLightbox(post5Images, 2)}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
          <div className="gallery-cta">
            <a href="https://www.instagram.com/brunagomesfisio/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Ver mais no Instagram
            </a>
          </div>
        </div>
      </section>

      <section id="servicos" className="services">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Serviços</span>
            <h2>Como posso te ajudar?</h2>
          </div>
          <div className="services-grid">
            <div className="service-card-wrapper">
              <div className="service-card featured">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <h3>Pilates Personalizado</h3>
                <p>Aulas individuais ou em dupla focadas em seus objetivos específicos. Fortalecimento, flexibilidade e consciência corporal.</p>
                <ul className="service-features">
                  <li>Avaliação postural inicial</li>
                  <li>Programa personalizado</li>
                  <li>Equipamentos completos</li>
                </ul>
              </div>
            </div>

            <div className="service-card-wrapper">
              <div className="service-card">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <path d="M20 8v6M23 11h-6"/>
                  </svg>
                </div>
                <h3>Fisioterapia</h3>
                <p>Tratamento especializado para reabilitação, prevenção de lesões e recuperação funcional.</p>
                <ul className="service-features">
                  <li>Reabilitação ortopédica</li>
                  <li>Tratamento de lesões</li>
                  <li>Prevenção e condicionamento</li>
                </ul>
              </div>
            </div>

            </div>
        </div>
      </section>



      <section id="localizacao" className="location">
        <div className="container">
          <div className="location-grid">
            <div className="location-info">
              <span className="section-label">Localização</span>
              <h2>Venha me visitar!</h2>
              <div className="location-details">
                <div className="location-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <strong>Medplex Eixo Norte</strong>
                    <p>Av. Assis Brasil, 2827 - Sala 1507 - Torre B<br />Porto Alegre, RS - CEP 91010-001<br />Próximo ao Shopping Wallig</p>
                  </div>
                </div>
                <div className="location-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <div>
                    <strong>Horários</strong>
                    <p>Segunda a Sexta: 07:00 - 20:00</p>
                  </div>
                </div>
                <div className="location-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <div>
                    <strong>Telefone</strong>
                    <p>(51) 99926-4181</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="location-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.8961896134597!2d-51.1897!3d-30.0277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95197906c3fd5555%3A0x6b8d1f6c8b8b8b8b!2sAv.%20Assis%20Brasil%2C%202827%20-%20S%C3%A3o%20Geraldo%2C%20Porto%20Alegre%20-%20RS%2C%2091010-001!5e0!3m2!1spt-BR!2sbr!4v1234567890!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '24px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Bruna Gomes - Pilates e Fisioterapia"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className="contact">
        <div className="container">
          <div className="contact-content">
            <div className="contact-text">
              <h2>Pronta para começar?</h2>
              <p>Entre em contato para agendar sua avaliação e conhecer o studio.</p>
            </div>
            <div className="contact-buttons">
              <a href="https://api.whatsapp.com/send/?phone=51999264181&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-large">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <a href="https://www.instagram.com/brunagomesfisio/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-large">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-col">
              <img src="/logo-horizontal2.svg" alt="Bruna Gomes" className="footer-logo" />
              <div style={{marginTop: '16px'}}>
                <p style={{fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '2px'}}>Bruna Gomes</p>
                <p style={{fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '8px'}}>CREFITO 272.375-F</p>
                <p style={{fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.65)'}}>Fisioterapia e Pilates</p>
              </div>
            </div>
            <div className="footer-col">
              <h4>Navegação</h4>
              <a href="#inicio">Início</a>
              <a href="#profissional">A Profissional</a>
              <a href="#sobre">Sobre</a>
              <a href="#servicos">Serviços</a>
              <a href="#localizacao">Localização</a>
            </div>
            <div className="footer-col">
              <h4>Localização</h4>
              <p style={{fontSize: '0.9375rem', lineHeight: '1.7'}}>
                Medplex Eixo Norte<br />
                Av. Assis Brasil, 2827<br />
                Sala 1507 - Torre B<br />
                Porto Alegre, RS<br />
                CEP 91010-001
              </p>
              <p style={{marginTop: '12px', fontSize: '0.875rem'}}>
                <strong>Horário:</strong><br />
                Seg a Sex: 07:00 - 20:00
              </p>
            </div>
            <div className="footer-col footer-social">
              <h4>Contato</h4>
              <div className="footer-social-icons">
                <a href="https://wa.me/5551999264181" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/brunagomesfisio/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="tel:+5551999264181" aria-label="Telefone">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Bruna Gomes - Pilates e Fisioterapia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Lightbox para visualização em tela cheia */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={currentPostImages.map(src => ({ src }))}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' }
        }}
      />
    </div>
  )
}

export default App
