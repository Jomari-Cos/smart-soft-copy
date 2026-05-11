document.addEventListener('DOMContentLoaded', () => {
    const teacherDrop = document.getElementById('teacherDrop');
    const registrarDrop = document.getElementById('registrarDrop');
    const teacherFile = document.getElementById('teacherFile');
    const registrarFile = document.getElementById('registrarFile');
    const vlookupBtn = document.getElementById('vlookupBtn');
    const teacherTable = document.querySelector('#teacherTable tbody');
    const registrarTable = document.querySelector('#registrarTable tbody');
    const resultTable = document.querySelector('#resultTable tbody');
    
    // Modal elements
    const guidelinesBtn = document.getElementById('guidelinesBtn');
    const pdfModal = document.getElementById('pdfModal');
    const closeModal = document.getElementById('closeModal');

    // Modal functionality - show modal on button click
    if (guidelinesBtn && pdfModal && closeModal) {
        guidelinesBtn.addEventListener('click', () => {
            pdfModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        closeModal.addEventListener('click', () => {
            pdfModal.classList.remove('show');
            document.body.style.overflow = '';
        });

        pdfModal.addEventListener('click', (e) => {
            if (e.target === pdfModal) {
                pdfModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && pdfModal.classList.contains('show')) {
                pdfModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    let teacherGrades = []; // {id, name, grade}
    let officialStudents = []; // {id, full_name}
    let submissionData = []; // {id, matched_student_id, confidence}

    function setButtonLoading(btn, loading) {
        if (loading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    function clearTableSkeleton(tableBody) {
        tableBody.innerHTML = '';
    }

    function showTableSkeleton(tableBody, rows = 4, widthClasses = []) {
        tableBody.innerHTML = '';
        for (let i = 0; i < rows; i += 1) {
            const tr = document.createElement('tr');
            tr.classList.add('skeleton-row');
            for (let j = 0; j < Math.max(widthClasses.length, 1); j += 1) {
                const td = document.createElement('td');
                const skeleton = document.createElement('div');
                skeleton.classList.add('skeleton-cell');
                const widthClass = widthClasses[j] || 'full';
                skeleton.classList.add(widthClass);
                td.appendChild(skeleton);
                tr.appendChild(td);
            }
            tableBody.appendChild(tr);
        }
    }

    document.querySelectorAll('.file-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            setButtonLoading(btn, true);
            document.getElementById(`${target}File`).click();
        });
    });

    teacherFile.addEventListener('change', (e) => handleFile(e, 'teacher'));
    registrarFile.addEventListener('change', (e) => handleFile(e, 'registrar'));

    [teacherDrop, registrarDrop].forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            const target = zone.id === 'teacherDrop' ? 'teacher' : 'registrar';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                processFile(files[0], target);
            }
        });
    });

    function handleFile(e, target) {
        const file = e.target.files[0];
        if (file) processFile(file, target);
    }

    function processFile(file, target) {
        const reader = new FileReader();
        const isCSV = file.name.endsWith('.csv');
        const btn = document.querySelector(`.file-btn[data-target="${target}"]`);
        const tableBody = target === 'teacher' ? teacherTable : registrarTable;

        clearTableSkeleton(tableBody);
        showTableSkeleton(tableBody, 4, target === 'teacher' ? ['medium', 'short'] : ['short', 'medium']);
        
        reader.onload = (e) => {
            const content = e.target.result;
            let data = [];
            if (isCSV) {
                data = parseCSVContent(content, target);
            } else {
                data = parseExcelContent(content, target);
            }
            if (target === 'teacher') {
                processTeacherData(data).finally(() => {
                    setButtonLoading(btn, false);
                });
            } else {
                processRegistrarData(data).finally(() => {
                    setButtonLoading(btn, false);
                });
            }
        };
        
        reader.onerror = () => {
            setButtonLoading(btn, false);
            alert('Error reading file');
        };
        
        if (isCSV) {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    }

    function findColumnIndex(headers, keywords) {
        // Find column index by matching header text against keywords
        for (let i = 0; i < headers.length; i++) {
            const header = String(headers[i] || '').toLowerCase().trim();
            if (!header) continue;
            for (const keyword of keywords) {
                if (header.includes(keyword.toLowerCase())) {
                    return i;
                }
            }
        }
        return -1; // Column not found
    }

    function parseCSVContent(content, target = 'teacher') {
        const lines = content.trim().split('\n');
        if (lines.length === 0) return [];
        
        // Parse header row
        const headerRow = lines[0].split(',').map(s => s.trim());
        
        // Try to find First Name and Last Name columns
        const firstNameIdx = findColumnIndex(headerRow, ['first name', 'first_name', 'fname']);
        const lastNameIdx = findColumnIndex(headerRow, ['last name', 'last_name', 'lname']);
        
        // Fall back to single Name column if first/last not found
        let nameIdx = -1;
        let useFirstLast = false;
        if (firstNameIdx !== -1 && lastNameIdx !== -1 && firstNameIdx !== lastNameIdx) {
            useFirstLast = true;
        } else {
            nameIdx = findColumnIndex(headerRow, ['name', 'student name', 'full name', 'teacher name']);
        }
        
        // Fallback to first column for registrar, first two for teacher
        if (!useFirstLast && nameIdx === -1) {
            nameIdx = 0;
        }
        
        const gradeColIndex = target === 'teacher' ? findColumnIndex(headerRow, ['grade', 'score', 'mark', 'grade submitted']) : -1;
        const gradeIdx = target === 'teacher' ? (gradeColIndex !== -1 ? gradeColIndex : 1) : -1;
        
        const data = [];
        lines.forEach((line, i) => {
            if (i === 0) return; // Skip header
            const columns = line.split(',').map(s => s.trim());
            
            let fullName = '';
            if (useFirstLast) {
                const firstName = columns.length > firstNameIdx ? columns[firstNameIdx] : '';
                const lastName = columns.length > lastNameIdx ? columns[lastNameIdx] : '';
                fullName = `${lastName}, ${firstName}`.trim();
            } else {
                fullName = columns.length > nameIdx ? columns[nameIdx] : '';
            }
            
            if (fullName) {
                const item = { name: fullName };
                if (target === 'teacher' && columns.length > gradeIdx) {
                    item.grade = columns[gradeIdx] || null;
                }
                data.push(item);
            }
        });
        return data;
    }

    function parseExcelContent(content, target = 'teacher') {
        try {
            const wb = XLSX.read(content, { type: 'binary' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
            
            if (jsonData.length === 0) return [];
            
            // Parse header row
            const headerRow = jsonData[0];
            
            // Try to find First Name and Last Name columns
            const firstNameIdx = findColumnIndex(headerRow, ['first name', 'first_name', 'fname']);
            const lastNameIdx = findColumnIndex(headerRow, ['last name', 'last_name', 'lname']);
            
            // Fall back to single Name column if first/last not found
            let nameIdx = -1;
            let useFirstLast = false;
            if (firstNameIdx !== -1 && lastNameIdx !== -1 && firstNameIdx !== lastNameIdx) {
                useFirstLast = true;
            } else {
                nameIdx = findColumnIndex(headerRow, ['name', 'student name', 'full name', 'teacher name']);
            }
            
            // Fallback to first column for registrar, first two for teacher
            if (!useFirstLast && nameIdx === -1) {
                nameIdx = 0;
            }
            
            const gradeColIndex = target === 'teacher' ? findColumnIndex(headerRow, ['grade', 'score', 'mark', 'grade submitted']) : -1;
            const gradeIdx = target === 'teacher' ? (gradeColIndex !== -1 ? gradeColIndex : 1) : -1;
            
            const data = [];
            jsonData.forEach((row, i) => {
                if (i === 0) return; // Skip header
                
                let fullName = '';
                if (useFirstLast) {
                    const firstName = row.length > firstNameIdx ? row[firstNameIdx] : '';
                    const lastName = row.length > lastNameIdx ? row[lastNameIdx] : '';
                    fullName = `${lastName}, ${firstName}`.trim();
                } else {
                    fullName = row.length > nameIdx ? row[nameIdx] : '';
                }
                
                if (fullName) {
                    const item = { name: fullName };
                    if (target === 'teacher' && row.length > gradeIdx && gradeIdx !== -1) {
                        item.grade = row[gradeIdx] || null;
                    }
                    data.push(item);
                }
            });
            return data;
        } catch (err) {
            console.error('Excel parse error:', err);
            return [];
        }
    }

    async function saveTeacherGrade(gradeData) {
        try {
            const response = await fetch('/api/teacher-grades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teacher_submitted_name: gradeData.name,
                    grade: gradeData.grade,
                    course_id: null
                })
            });
            if (!response.ok) throw new Error('Failed to save');
            return await response.json();
        } catch (err) {
            console.error('Error saving teacher grade:', err);
            return null;
        }
    }

    async function saveStudent(studentData) {
        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: studentData.name,
                    email: null
                })
            });
            if (!response.ok) throw new Error('Failed to save');
            return await response.json();
        } catch (err) {
            console.error('Error saving student:', err);
            return null;
        }
    }

    async function processTeacherData(data) {
        const savedGrades = [];
        for (const item of data) {
            if (!item.name || !item.grade) {
                console.warn('Skipping invalid teacher row:', item);
                continue;
            }
            const saved = await saveTeacherGrade(item);
            if (saved) {
                savedGrades.push(saved);
            }
        }
        teacherGrades = savedGrades.map(g => ({
            id: g.id,
            name: g.teacher_submitted_name,
            grade: g.grade
        }));
        updateTeacherTable(savedGrades);
        return teacherGrades; // Return for promise chaining
    }

    async function processRegistrarData(data) {
        const savedStudents = [];
        for (const item of data) {
            if (!item.name) {
                console.warn('Skipping invalid registrar row:', item);
                continue;
            }
            const saved = await saveStudent({ name: item.name });
            if (saved) {
                savedStudents.push(saved);
            }
        }
        officialStudents = savedStudents.map(s => ({
            id: s.id,
            full_name: s.full_name
        }));
        updateRegistrarTable(savedStudents);
        return officialStudents; // Return for promise chaining
    }

    function updateTeacherTable(data) {
        teacherTable.innerHTML = '';
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${item.teacher_submitted_name || item.name}</td><td>${item.grade}</td>`;
            teacherTable.appendChild(tr);
        });
    }

    function updateRegistrarTable(data) {
        registrarTable.innerHTML = '';
        data.forEach((item, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i + 1}</td><td>${item.full_name || item.name}</td>`;
            registrarTable.appendChild(tr);
        });
    }

    function calculateSimilarity(a, b) {
        const str1 = a.toLowerCase().replace(/\s+/g, '');
        const str2 = b.toLowerCase().replace(/\s+/g, '');
        if (str1 === str2) return 1.0;
        if (str1.length === 0) return 0;
        if (str2.length === 0) return 0;
        
        const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
        for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
        
        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + cost
                );
            }
        }
        return 1 - (matrix[str2.length][str1.length] / Math.max(str1.length, str2.length));
    }

    vlookupBtn.addEventListener('click', () => {
        resultTable.innerHTML = '';
        submissionData = [];

        if (teacherGrades.length === 0 || officialStudents.length === 0) {
            alert('Please upload both teacher and registrar lists first.');
            return;
        }

        showTableSkeleton(resultTable, Math.min(6, teacherGrades.length || 4), ['short','medium','short','full','short','short']);
        setButtonLoading(vlookupBtn, true);
        
        // Use setTimeout to allow UI to update before heavy computation
        setTimeout(() => {
            clearTableSkeleton(resultTable);
            teacherGrades.forEach((tg, idx) => {
                let bestMatch = null;
                let bestConf = 0;
                let bestStudentId = null;
                
                officialStudents.forEach(s => {
                    const conf = calculateSimilarity(tg.name, s.full_name);
                    if (conf > bestConf) {
                        bestConf = conf;
                        bestMatch = s.full_name;
                        bestStudentId = s.id;
                    }
                });
                
                const tr = document.createElement('tr');
                const status = bestConf >= 0.95 ? 'Found' : 'Not Found';
                const confClass = bestConf >= 0.95 ? 'confidence-high' :
                                 bestConf >= 0.85 ? 'confidence-medium' : 'confidence-low';
                const statusClass = bestConf >= 0.95 ? 'status-found' : 'status-notfound';
                const rowNum = idx + 1;

                tr.innerHTML = `
                    <td>${rowNum}</td>
                    <td>${tg.name}</td>
                    <td>${tg.grade}</td>
                    <td>${bestMatch || '-'}</td>
                    <td class="${confClass}">${Math.round(bestConf * 100)}%</td>
                    <td class="${statusClass}">${status}</td>
                `;
                resultTable.appendChild(tr);
                
                tr.addEventListener('click', () => {
                    resultTable.querySelectorAll('tr').forEach(r => r.classList.remove('row-highlight'));
                    tr.classList.add('row-highlight');
                });

                submissionData.push({
                    id: tg.id,
                    matched_student_id: bestConf >= 0.95 ? bestStudentId : null,
                    confidence: bestConf
                });
            });
            
            setButtonLoading(vlookupBtn, false);
        }, 100);
    });

    function getResultTableData() {
        const rows = [];
        resultTable.querySelectorAll('tr').forEach(tr => {
            const cells = tr.querySelectorAll('td');
            if (cells.length >= 6) {
                rows.push({
                    '#': cells[0].textContent.trim(),
                    'Student Names': cells[1].textContent.trim(),
                    'Grade': cells[2].textContent.trim(),
                    'Registrar Match': cells[3].textContent.trim(),
                    'Confidence': cells[4].textContent.trim(),
                    'Status': cells[5].textContent.trim()
                });
            }
        });
        return rows;
    }

    function exportToXLSX() {
        const data = getResultTableData();
        if (data.length === 0) {
            alert('No results to export');
            return;
        }
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Results');
        XLSX.writeFile(wb, 'results.xlsx');
    }

    function exportToCSV() {
        const data = getResultTableData();
        if (data.length === 0) {
            alert('No results to export');
            return;
        }
        const headers = ['#', 'Student Names', 'Grade', 'Registrar Match', 'Confidence', 'Status'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'results.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    document.getElementById('exportXlsxBtn').addEventListener('click', exportToXLSX);
    document.getElementById('exportCsvBtn').addEventListener('click', exportToCSV);
});
