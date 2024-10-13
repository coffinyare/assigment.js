const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function calculateTotalTarget(startDate, endDate, totalAnnualTarget) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Function to get the number of days in a month excluding Fridays
  function getWorkingDaysInMonth(year, month) {
    let workingDays = 0;
    let daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the number of days in the month
    
    for (let day = 1; day <= daysInMonth; day++) {
      let currentDate = new Date(year, month, day);
      let dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 5) { // Exclude Fridays (Friday is 5 in getDay())
        workingDays++;
      }
    }
    return workingDays;
  }

  // Calculate days worked within the start and end range, excluding Fridays
  function getDaysWorkedInRange(start, end) {
    let yearStart = start.getFullYear();
    let monthStart = start.getMonth();
    let yearEnd = end.getFullYear();
    let monthEnd = end.getMonth();
    
    let daysExcludingFridays = [];
    let daysWorkedExcludingFridays = [];
    let monthlyTargets = [];
    let totalWorkedDays = 0;

    for (let year = yearStart; year <= yearEnd; year++) {
      let monthStartIndex = year === yearStart ? monthStart : 0;
      let monthEndIndex = year === yearEnd ? monthEnd : 11;
      
      for (let month = monthStartIndex; month <= monthEndIndex; month++) {
        let totalWorkingDays = getWorkingDaysInMonth(year, month);
        daysExcludingFridays.push(totalWorkingDays);
        
        let firstDay = (year === yearStart && month === monthStart) ? start.getDate() : 1;
        let lastDay = (year === yearEnd && month === monthEnd) ? end.getDate() : new Date(year, month + 1, 0).getDate();
        
        let workedDays = 0;
        for (let day = firstDay; day <= lastDay; day++) {
          let currentDate = new Date(year, month, day);
          let dayOfWeek = currentDate.getDay();
          if (dayOfWeek !== 5) { // Exclude Fridays
            workedDays++;
          }
        }
        daysWorkedExcludingFridays.push(workedDays);
        totalWorkedDays += workedDays;
      }
    }
    
    // Proportional distribution of the totalAnnualTarget based on worked days
    for (let i = 0; i < daysWorkedExcludingFridays.length; i++) {
      let monthlyTarget = (daysWorkedExcludingFridays[i] / totalWorkedDays) * totalAnnualTarget;
      monthlyTargets.push(monthlyTarget);
    }
    
    return {
      daysExcludingFridays,
      daysWorkedExcludingFridays,
      monthlyTargets,
      totalTarget: monthlyTargets.reduce((a, b) => a + b, 0),
    };
  }

  return getDaysWorkedInRange(start, end);
}

// Prompt the user for input
rl.question('Enter the start date (YYYY-MM-DD): ', (startDate) => {
  rl.question('Enter the end date (YYYY-MM-DD): ', (endDate) => {
    rl.question('Enter the total annual target: ', (totalAnnualTarget) => {
      const result = calculateTotalTarget(startDate, endDate, parseFloat(totalAnnualTarget));
      console.log(result);
      rl.close();
    });
  });
});