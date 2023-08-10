const navList = document.querySelector('.navbar ul');
const burger = document.querySelector('.burger');
    
    burger.addEventListener('click', function () {
            if (navList.classList.contains('nav-active')) {
                navList.classList.remove('nav-active');
                navList.style.maxHeight = null;
            } else {
                navList.classList.add('nav-active');
                navList.style.maxHeight = navList.scrollHeight + 'px';
            }
        });
    
        window.addEventListener('resize', function () {
            if (window.innerWidth > 700 && navList.classList.contains('nav-active')) {
                navList.classList.remove('nav-active');
                navList.style.maxHeight = null;
            }
        });
    
        document.addEventListener('click', function (event) {
            if (!navList.contains(event.target) && !burger.contains(event.target) && navList.classList.contains('nav-active')) {
                navList.classList.remove('nav-active');
                navList.style.maxHeight = null;
            }
        });
    
        navList.addEventListener('click', function (event) {
            event.stopPropagation();
        });