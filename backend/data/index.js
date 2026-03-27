const fs = require('fs');
const path = require('path');

function loadData() {
    try {
        const file1 = fs.readFileSync(path.join(__dirname, 'properties_1.json'), 'utf8');
        const file2 = fs.readFileSync(path.join(__dirname, 'properties_2.json'), 'utf8');
        const file3 = fs.readFileSync(path.join(__dirname, 'properties_3.json'), 'utf8');

        const data1 = JSON.parse(file1);
        const data2 = JSON.parse(file2);
        const data3 = JSON.parse(file3);

        const mergedMap = new Map();

        data1.forEach(item => mergedMap.set(item.id, { ...item }));
        data2.forEach(item => {
            if (mergedMap.has(item.id)) {
                mergedMap.set(item.id, { ...mergedMap.get(item.id), ...item });
            }
        });
        data3.forEach(item => {
            if (mergedMap.has(item.id)) {
                mergedMap.set(item.id, { ...mergedMap.get(item.id), ...item });
            }
        });

        return Array.from(mergedMap.values());
    } catch (error) {
        console.error("Error loading JSON data:", error);
        return [];
    }
}

const properties = loadData();
module.exports = properties;
