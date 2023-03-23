/*```
0. To run file type `node tasks.js in_1000000.json`.
   Example structure of `in_xxxxx.json`:
   ```
   {
    "items": [
      {
          "package": "FLEXIBLE",
          "created": "2020-03-10T00:00:00",
          "summary": [
              {
                  "period": "2019-12",
                  "documents": {
                      "incomes": 63,
                      "expenses": 13
                  }
              },
              {
                  "period": "2020-02",
                  "documents": {
                      "incomes": 45,
                      "expenses": 81
                  }
              }
          ]
      },
      {
          "package": "ENTERPRISE",
          "created": "2020-03-19T00:00:00",
          "summary": [
              {
                  "period": "2020-01",
                  "documents": {
                      "incomes": 15,
                      "expenses": 52
                  }
              },
              {
                  "period": "2020-02",
                  "documents": {
                      "incomes": 76,
                      "expenses": 47
                  }
              }
          ]
      }
    ]
   }
*/

//Started around 15:30, finished 15:57
function task_1(data_in) {
  /*
        Return number of items per created[year-month].
        Add missing [year-month] with 0 if no items in data.
        ex. {
            '2020-03': 29,
            '2020-04': 0, # created[year-month] does not occur in data
            '2020-05': 24
        }
    */
  const counter = {};

  // Loop through each item in the 'items' array
  data_in.items.forEach((item) => {
    // Get the 'created' date of the item and extract the year-month string
    const created = new Date(item.created).toISOString().substr(0, 7);
    // If the year-month is not in the counter object, initialize it with a count of 1
    if (counter[created] === undefined) {
      counter[created] = 1;
      // If the year-month is already in the counter object, increment its count
    } else {
      counter[created]++;
    }
  });
  return counter;
}

//Start 16:10, finish 16:55
function task_2(data_in) {
  /*
        Return number of documents per period (incomes, expenses, total).
        Return only periods provided in data.
        ex. {
            '2020-04': {
                'incomes': 2480,
                'expenses': 2695,
                'total': 5175
            },
            '2020-05': {
                'incomes': 2673,
                'expenses': 2280,
                'total': 4953
            }
        }
    */

  const result = {};

  // Iterate over each item in the data and then iterate over each summary
  data_in.items.forEach((item) => {
    item.summary.forEach((s) => {
      // Extract the period, incomes, and expenses from each summary
      const period = s.period;
      const incomes = s.documents.incomes;
      const expenses = s.documents.expenses;
      const total = incomes + expenses;

      // If the period doesn't exist in the result yet, create a new entry for it
      // If the period already exists, add the incomes, expenses, and total to the existing entry
      if (result[period] === undefined) {
        result[period] = { incomes, expenses, total };
      } else {
        result[period].incomes += incomes;
        result[period].expenses += expenses;
        result[period].total += total;
      }
    });
  });

  return result;
}

function task_3(data_in) {
  /*
        Return average(integer) number of documents per day
        in last three months counted from last period in data
        for package in ['ENTERPRISE', 'FLEXIBLE']
        as one int
        ex. 64
    */
  // Calculate the timestamp of the last period in data
  const lastPeriod = data_in.items
    .flatMap((item) => item.summary)
    .map((summary) => new Date(summary.period).getTime())
    .reduce((max, timestamp) => Math.max(max, timestamp), 0);

  // Calculate the timestamp of the first day three months before the last period
  const threeMonthsAgo = new Date(lastPeriod);
  threeMonthsAgo.setUTCMonth(threeMonthsAgo.getUTCMonth() - 3);
  const firstDayOfThreeMonthsAgo = new Date(
    threeMonthsAgo.getUTCFullYear(),
    threeMonthsAgo.getUTCMonth(),
    1
  ).getTime();

  // Calculate the total number of documents in the last three months
  const totalDocs = data_in.items
    .filter((item) => ["ENTERPRISE", "FLEXIBLE"].includes(item.package))
    .flatMap((item) => item.summary)
    .filter(
      (summary) =>
        new Date(summary.period).getTime() >= firstDayOfThreeMonthsAgo
    )
    .map((summary) => summary.documents.incomes + summary.documents.expenses)
    .reduce((sum, value) => sum + value, 0);

  // Calculate the number of days in the last three months
  const numDays = Math.floor(
    (lastPeriod - firstDayOfThreeMonthsAgo) / (24 * 3600 * 1000)
  );

  // Calculate the average number of documents per day
  return Math.round(totalDocs / numDays);
}

if (require.main === module) {
  const { readFileSync } = require("fs");
  filename = process.argv.find((i) => i.endsWith(".json"));
  if (!filename) {
    console.log(`USAGE:
    node tasks.js <filename>

    Example:
    node tasks.js in_1000000.json
`);
    process.exit(1);
  }
  const dataIn = JSON.parse(readFileSync(filename));
  [task_1, task_2, task_3].forEach((func) => {
    const out = JSON.stringify(func(dataIn));
    console.log(`\n>>> ${func.name}\n${out}`);
  });
}
