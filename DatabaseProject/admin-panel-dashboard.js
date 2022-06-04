const chart = document.querySelector("#chart").getContext('2d');

// Create a new chart instance
new Chart (chart, {
    type: 'line',
    data:{
        labels: ['Jan','Feb','Mar','Apr','May','June','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets:[
            {
                label: 'BTC',
                data: [29734,33242,44323,11123,74212,33212,32111,62322,34567,66623,12366],
                borderColor: 'green',
                borderWidth: 2
            },
            {
                label: 'ETH',
                data: [22177,12352,42100,13568,45251,62221,74646,54732,33531,55247,68941],
                borderColor: 'yellow',
                borderWidth: 2
            }
        ]
    },
    options:{
        responsive: true
    }
})