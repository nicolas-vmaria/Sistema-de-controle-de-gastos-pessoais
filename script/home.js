// Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));

    // Animate bars on load
    document.addEventListener('DOMContentLoaded', () => {
      const bars = document.querySelectorAll('.bar');
      bars.forEach((bar, i) => {
        const h = bar.style.height;
        bar.style.height = '4px';
        setTimeout(() => {
          bar.style.height = h;
        }, 800 + i * 60);
      });
    });