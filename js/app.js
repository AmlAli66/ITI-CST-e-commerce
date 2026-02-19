

console.log("App started");

        function createSnowflake() {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = '❅';
            snowflake.style.left = Math.random() * window.innerWidth + 'px';
            snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
            
            // Optional: Vary the opacity for each snowflake (between 30% and 70%)
            snowflake.style.opacity = Math.random() * 0.4 + 0.3;
            
            document.body.appendChild(snowflake);           
            setTimeout(() => {
                snowflake.remove();
            }, 10000);
        }
        // Start snow automatically when page loads
        setInterval(createSnowflake, 800);
