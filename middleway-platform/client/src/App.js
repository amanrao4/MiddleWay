import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MeetupFormPage from './pages/MeetupFormPage';
import NotFoundPage from './pages/NotFoundPage';
import useRouterReady from './hooks/useRouterReady';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const Header = lazy(() => import('./components/Header')); // ✅ lazy load

function App() {
    const routerReady = useRouterReady();

    if (!routerReady) return null;

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}> {/* ✅ fallback UI */}
                <Header />
            </Suspense>
            <main className="py-3">
                <Container>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/meetup" element={<MeetupFormPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Container>
            </main>
            <Footer />
        </>
    );
}

export default App;
