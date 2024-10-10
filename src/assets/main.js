import 'flowbite';

document.addEventListener('DOMContentLoaded', () => {
    const updateButtonImg = () => {
        const svgEnableDark = document.getElementById('svg-enable-dark-mode');
        const svgEnableLight = document.getElementById('svg-enable-light-mode');

        const darkMode = root.classList.contains('dark')
        svgEnableDark.style.display = darkMode ? 'none' : '';
        svgEnableLight.style.display = darkMode ? '' : 'none';
    }

    const root = document.documentElement;
    const button = document.getElementById('toggle-dark-mode');
    updateButtonImg();

    button.addEventListener('click', (e) => {
        e.preventDefault();
        root.classList.toggle('dark');
        updateButtonImg();
    });
});
