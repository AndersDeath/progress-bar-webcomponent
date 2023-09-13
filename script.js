document.addEventListener('DOMContentLoaded', () => {

    const demoArr = [
        ["#demoInput1", '#progressBar1'],
        ["#demoInput2", '#progressBar2'],
        ["#demoInput3", '#progressBar3'],
    ]

    for (let index = 0; index < demoArr.length; index++) {
        document.querySelector(demoArr[index][0]).addEventListener("change", (e) => {
            let value = e.target.value;
            if (value > 100) value = 100;
            if (value < 0) value = 0;
            document.querySelector(demoArr[index][1]).setAttribute('percent', value);
        });
    }

});
