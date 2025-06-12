const fs = require('fs');
const { parse } = require('csv-parse');
const { stringify } = require('csv-stringify');

// Example function to read a CSV file
function readCSV(filePath) {
    const records = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(parse({
                columns: true,
                skip_empty_lines: true
            }))
            .on('data', (record) => records.push(record))
            .on('end', () => resolve(records))
            .on('error', reject);
    });
}

// Example function to write a CSV file
function writeCSV(filePath, data) {
    return new Promise((resolve, reject) => {
        stringify(data, {
            header: true
        }, (err, output) => {
            if (err) {
                reject(err);
                return;
            }
            fs.writeFile(filePath, output, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });
}

// Example usage:
async function example() {
    try {
        // Create sample data
        const sampleData = [
            { name: 'John', age: 30, city: 'New York' },
            { name: 'Alice', age: 25, city: 'Los Angeles' },
            { name: 'Bob', age: 35, city: 'Chicago' }
        ];

        // Write sample data to CSV
        await writeCSV('output.csv', sampleData);
        console.log('CSV file written successfully');

        // Read the CSV file back
        const records = await readCSV('output.csv');
        console.log('Read CSV contents:', records);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the example
example(); 