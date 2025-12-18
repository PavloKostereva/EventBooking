import { Link } from 'react-router-dom'
import PastEvents from '../components/Home/PastEvents'
import Features from '../components/Home/Features'
import '../styles/home.css'

const HomePage = () => {
    return (
        <>
            <section className="hero-section">
                <div className="img-home">
                    <img src="/images/homeimage.jpg" alt="Початкове зображення" />
                </div>
                <div className="home-text">
                    <h3>Ласкаво просимо на платформу онлайн-бронювання квитків!</h3>
                    <p>Оберіть подію, забронюйте квиток і насолоджуйтесь незабутніми враженнями.</p>
                    <Link to="/events" className="btn">Переглянути події</Link>
                </div>
            </section>

            <Features />

            <PastEvents />

            <section className="stats-section">
                <div className="stats-container">
                    <div className="stat-item">
                        <div className="stat-number">1000+</div>
                        <div className="stat-label">Подій</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">50K+</div>
                        <div className="stat-label">Задоволених клієнтів</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">99%</div>
                        <div className="stat-label">Позитивних відгуків</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">Підтримка</div>
                    </div>
                </div>
            </section>

            <div className="conclusion">
                <h4>Якщо не хочеш пропустити наяскравіші події, бронюй білети з нами!</h4>
            </div>
        </>
    )
}

export default HomePage