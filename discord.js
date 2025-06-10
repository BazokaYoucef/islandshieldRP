        const webhookURL = '';

        function openPurchaseForm(productName) {
            document.getElementById('product').value = productName;
            document.getElementById('purchaseModal').style.display = "block";
            updateSubmitButtonStatus(); 
        }

        function closePurchaseForm() {
            document.getElementById('purchaseModal').style.display = "none";
        }

        function filterProducts(category) {
            const allProducts = document.querySelectorAll('.product-card');
            if (category === 'all') {
                allProducts.forEach(product => product.style.display = 'block');
            } else {
                allProducts.forEach(product => {
                    if (product.getAttribute('data-product') === category) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            }
        }

        function updateSubmitButtonStatus() {
            const submitButton = document.getElementById('purchaseForm').querySelector('button[type="submit"]');
            const lastSubmitTime = localStorage.getItem('lastSubmitTimePurchase');
            const currentTime = new Date().getTime();
            const cooldownTime = 1 * 60 * 60 * 1000; 

            if (lastSubmitTime) {
                const timePassed = currentTime - lastSubmitTime;

                if (timePassed < cooldownTime) {
                    const timeLeft = Math.ceil((cooldownTime - timePassed) / 1000);
                    submitButton.disabled = true;
                    submitButton.innerText = `يمكنك الإرسال بعد ${Math.floor(timeLeft / 320)} دقيقة و ${timeLeft % 60} ثانية`;
                } else {
                    submitButton.disabled = false;
                    submitButton.innerText = 'إرسال';
                }
            } else {
                submitButton.disabled = false;
                submitButton.innerText = 'إرسال';
            }
        }

        document.getElementById('purchaseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitButton = e.target.querySelector('button[type="submit"]');
            if (submitButton.disabled) return;

            const discordId = document.getElementById('discordId').value;
            const accountId = document.getElementById('accountId').value;
            const product = document.getElementById('product').value;

            const webhookData = {
                content: `طلب شراء جديد\n\n**إيدي الديسكورد:** ${discordId}\n**إيدي الحساب:** ${accountId}\n**المنتج:** ${product}`
            };

            fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(webhookData)
            })
            .then(response => {
                if (response.ok) {
                    alert('تم إرسال طلب الشراء بنجاح!');
                    submitButton.disabled = true;
                    submitButton.innerText = 'تم الإرسال. يمكنك الإرسال مرة أخرى بعد ساعة.';
                    localStorage.setItem('lastSubmitTimePurchase', new Date().getTime());
                    closePurchaseForm();
                } else {
                    return response.text().then(text => { throw new Error(text); });
                }
            })
            .catch(error => {
                console.error('حدث خطأ:', error);
                alert('حدث خطأ أثناء إرسال طلب الشراء.');
            });
        });