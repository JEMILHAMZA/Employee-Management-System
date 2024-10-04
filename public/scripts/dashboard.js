// public/scripts/dashboard/js
        
// Helper function to generate random colors
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Employee Distribution by Department with dynamic colors
    const departmentColors = employeeDistributionData.map(() => getRandomColor());
    const employeeDistributionChart = new Chart(document.getElementById('employee-distribution-chart'), {
        type: 'bar',
        data: {
            labels: employeeDistributionData.map(dept => dept._id),
            datasets: [{
                label: '# of Employees',
                data: employeeDistributionData.map(dept => dept.count),
                backgroundColor: departmentColors,
                borderColor: departmentColors,
                borderWidth: 1
            }]
        },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Keep this true to maintain the aspect ratio
        layout: {
            padding: {
                top: 10,
                bottom: 10
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
    });

    // Employee Status Distribution with predefined colors
    const statusColors = ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 99, 132, 0.6)'];
    const employeeStatusChart = new Chart(document.getElementById('employee-status-chart'), {
        type: 'pie',
        data: {
            labels: employeeStatusData.map(status => status._id),
            datasets: [{
                label: '# of Employees',
                data: employeeStatusData.map(status => status.count),
                backgroundColor: statusColors,
                borderColor: statusColors.map(color => color.replace('0.6', '1')),
                borderWidth: 1
            }]
        },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Keep this true to maintain the aspect ratio
        layout: {
            padding: {
                top: 10,
                bottom: 10
            }
        }
    }
    });

    // Gender Diversity
    const genderDiversityChart = new Chart(document.getElementById('gender-diversity-chart'), {
        type: 'doughnut',
        data: {
            labels: genderDiversityData.map(gender => gender._id),
            datasets: [{
                label: '# of Employees',
                data: genderDiversityData.map(gender => gender.count),
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }]
        },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Keep this true to maintain the aspect ratio
        layout: {
            padding: {
                top: 10,
                bottom: 10
            }
        }
    }
    });


    // Employment Type Distribution with predefined colors
    const employmentTypeColors = ['rgba(153, 102, 255, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'];
    const employmentTypeChart = new Chart(document.getElementById('employment-type-chart'), {
        type: 'bar',
        data: {
            labels: employmentTypeData.map(type => type._id),
            datasets: [{
                label: '# of Employees',
                data: employmentTypeData.map(type => type.count),
                backgroundColor: employmentTypeColors,
                borderColor: employmentTypeColors.map(color => color.replace('0.6', '1')),
                borderWidth: 1
            }]
        },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Keep this true to maintain the aspect ratio
        layout: {
            padding: {
                top: 10,
                bottom: 10
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
    });