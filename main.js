console.log(MaterialDatetimePicker);
document.addEventListener("DOMContentLoaded", function(event) {
    var picker = new MaterialDatetimePicker()
    .on('submit', (val) => console.log(`data: ${val}`))
    .on('open', () => console.log('opened'))
    .on('close', () => console.log('closed'));
    
    var el = document.querySelector('.c-datepicker-btn')
    el.addEventListener('click', () => picker.open()); 
    console.log("DOM fully loaded and parsed");
});

