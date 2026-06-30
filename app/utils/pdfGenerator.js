/**
 * PDF Generation Utilities
 * Generates PDF reports for projects, test cases, requirements, etc.
 * 
 * NOTE: This uses jsPDF library
 * Install: npm install jspdf jspdf-autotable
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Format date to readable string
 */
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Add header to PDF
 */
const addHeader = (doc, title) => {
  // Logo placeholder (you can add actual logo here)
  doc.setFillColor(26, 38, 74); // Navy color
  doc.rect(15, 10, 30, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIXA', 21, 28);
  
  // Title
  doc.setTextColor(26, 38, 74);
  doc.setFontSize(24);
  doc.text(title, 50, 25);
  
  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${formatDate(new Date())}`, 50, 35);
  
  // Line separator
  doc.setDrawColor(26, 38, 74);
  doc.setLineWidth(0.5);
  doc.line(15, 45, 195, 45);
};

/**
 * Add footer to PDF
 */
const addFooter = (doc, pageNumber, totalPages) => {
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Page ${pageNumber} of ${totalPages} | © ${new Date().getFullYear()} Verixa Engineering`,
    105,
    pageHeight - 10,
    { align: 'center' }
  );
};

/**
 * Add section title
 */
const addSectionTitle = (doc, title, yPosition) => {
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 38, 74);
  doc.text(title, 15, yPosition);
  
  doc.setDrawColor(26, 38, 74);
  doc.setLineWidth(0.3);
  doc.line(15, yPosition + 2, 195, yPosition + 2);
  
  return yPosition + 10;
};

/**
 * Check if new page is needed
 */
const checkNewPage = (doc, currentY, spaceNeeded = 30) => {
  const pageHeight = doc.internal.pageSize.height;
  if (currentY + spaceNeeded > pageHeight - 30) {
    doc.addPage();
    return 50; // Start position on new page
  }
  return currentY;
};

/**
 * Generate Project Summary PDF
 */
export const generateProjectSummaryPDF = (projectData) => {
  const doc = new jsPDF();
  let yPosition = 55;
  
  // Header
  addHeader(doc, 'Project Summary Report');
  
  // Project Information
  yPosition = addSectionTitle(doc, '1. Project Information', yPosition);
  
  const projectInfo = [
    ['Project Name', projectData.title || 'N/A'],
    ['Status', projectData.projectStatus || 'N/A'],
    ['Field', projectData.field || 'N/A'],
    ['Created Date', formatDate(projectData.createdAt)],
    ['Last Updated', formatDate(projectData.updatedAt)],
  ];
  
  doc.autoTable({
    startY: yPosition,
    head: [['Property', 'Value']],
    body: projectInfo,
    theme: 'striped',
    headStyles: { fillColor: [26, 38, 74], textColor: [255, 255, 255] },
    margin: { left: 15, right: 15 },
  });
  
  yPosition = doc.lastAutoTable.finalY + 15;
  
  // Project Description
  yPosition = checkNewPage(doc, yPosition);
  yPosition = addSectionTitle(doc, '2. Project Description', yPosition);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const description = doc.splitTextToSize(projectData.description || 'No description available.', 165);
  doc.text(description, 15, yPosition);
  yPosition += description.length * 7 + 15;
  
  // Statistics
  if (projectData.statistics) {
    yPosition = checkNewPage(doc, yPosition);
    yPosition = addSectionTitle(doc, '3. Project Statistics', yPosition);
    
    const stats = [
      ['Total Requirements', projectData.statistics.totalRequirements || 0],
      ['Total Test Cases', projectData.statistics.totalTestCases || 0],
      ['Total Test Runs', projectData.statistics.totalRuns || 0],
      ['Total Executions', projectData.statistics.totalExecutions || 0],
      ['Open Defects', projectData.statistics.openDefects || 0],
      ['Pass Rate', `${projectData.statistics.passRate || 0}%`],
    ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Metric', 'Count']],
      body: stats,
      theme: 'grid',
      headStyles: { fillColor: [26, 38, 74] },
      margin: { left: 15, right: 15 },
    });
    
    yPosition = doc.lastAutoTable.finalY + 15;
  }
  
  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }
  
  // Save
  doc.save(`${projectData.title || 'Project'}_Summary_${Date.now()}.pdf`);
};

/**
 * Generate Requirements Report PDF
 */
export const generateRequirementsReportPDF = (requirements, projectName = 'Project') => {
  const doc = new jsPDF();
  let yPosition = 55;
  
  addHeader(doc, 'Requirements Report');
  
  // Summary
  yPosition = addSectionTitle(doc, '1. Summary', yPosition);
  
  const summary = [
    ['Project', projectName],
    ['Total Requirements', requirements.length],
    ['Functional', requirements.filter(r => r.type === 'Functional').length],
    ['Non-Functional', requirements.filter(r => r.type === 'Non-Functional').length],
    ['High Priority', requirements.filter(r => r.priority === 'High').length],
  ];
  
  doc.autoTable({
    startY: yPosition,
    body: summary,
    theme: 'plain',
    margin: { left: 15 },
  });
  
  yPosition = doc.lastAutoTable.finalY + 15;
  
  // Requirements Details
  yPosition = checkNewPage(doc, yPosition);
  yPosition = addSectionTitle(doc, '2. Requirements Details', yPosition);
  
  requirements.forEach((req, index) => {
    yPosition = checkNewPage(doc, yPosition, 60);
    
    // Requirement Header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 38, 74);
    doc.text(`${index + 1}. ${req.title}`, 15, yPosition);
    yPosition += 8;
    
    // Requirement Details
    doc.autoTable({
      startY: yPosition,
      body: [
        ['Type', req.type || 'N/A'],
        ['Priority', req.priority || 'N/A'],
        ['Status', req.status || 'N/A'],
        ['Description', req.description || 'No description'],
      ],
      theme: 'plain',
      margin: { left: 20 },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 30, fontStyle: 'bold' },
        1: { cellWidth: 150 },
      },
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
  });
  
  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }
  
  doc.save(`Requirements_Report_${Date.now()}.pdf`);
};

/**
 * Generate Test Cases Report PDF
 */
export const generateTestCasesReportPDF = (testCases, projectName = 'Project') => {
  const doc = new jsPDF();
  let yPosition = 55;
  
  addHeader(doc, 'Test Cases Report');
  
  // Summary
  yPosition = addSectionTitle(doc, '1. Summary', yPosition);
  
  const summary = [
    ['Project', projectName],
    ['Total Test Cases', testCases.length],
    ['High Priority', testCases.filter(tc => tc.priority === 'High').length],
    ['Medium Priority', testCases.filter(tc => tc.priority === 'Medium').length],
    ['Low Priority', testCases.filter(tc => tc.priority === 'Low').length],
  ];
  
  doc.autoTable({
    startY: yPosition,
    body: summary,
    theme: 'plain',
    margin: { left: 15 },
  });
  
  yPosition = doc.lastAutoTable.finalY + 15;
  
  // Test Cases Table
  yPosition = checkNewPage(doc, yPosition);
  yPosition = addSectionTitle(doc, '2. Test Cases List', yPosition);
  
  const tableData = testCases.map((tc, index) => [
    index + 1,
    tc.title || 'N/A',
    tc.priority || 'N/A',
    tc.type || 'N/A',
    tc.status || 'N/A',
  ]);
  
  doc.autoTable({
    startY: yPosition,
    head: [['#', 'Title', 'Priority', 'Type', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [26, 38, 74] },
    margin: { left: 15, right: 15 },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
    },
  });
  
  yPosition = doc.lastAutoTable.finalY + 15;
  
  // Detailed Test Cases
  doc.addPage();
  yPosition = 50;
  yPosition = addSectionTitle(doc, '3. Test Cases Details', yPosition);
  
  testCases.forEach((tc, index) => {
    yPosition = checkNewPage(doc, yPosition, 80);
    
    // Test Case Header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 38, 74);
    doc.text(`${index + 1}. ${tc.title}`, 15, yPosition);
    yPosition += 8;
    
    // Test Case Details
    doc.autoTable({
      startY: yPosition,
      body: [
        ['Priority', tc.priority || 'N/A'],
        ['Type', tc.type || 'N/A'],
        ['Description', tc.description || 'No description'],
        ['Preconditions', tc.preconditions || 'None'],
        ['Test Steps', tc.steps || 'Not specified'],
        ['Expected Result', tc.expectedResult || 'Not specified'],
      ],
      theme: 'plain',
      margin: { left: 20 },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold' },
        1: { cellWidth: 145 },
      },
    });
    
    yPosition = doc.lastAutoTable.finalY + 12;
  });
  
  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }
  
  doc.save(`Test_Cases_Report_${Date.now()}.pdf`);
};

/**
 * Generate Comprehensive Project Report
 */
export const generateComprehensiveReportPDF = (data) => {
  const doc = new jsPDF();
  let yPosition = 55;
  
  addHeader(doc, 'Comprehensive Project Report');
  
  // Table of Contents
  yPosition = addSectionTitle(doc, 'Table of Contents', yPosition);
  
  const toc = [
    '1. Executive Summary',
    '2. Project Information',
    '3. Requirements Overview',
    '4. Test Cases Overview',
    '5. Test Execution Summary',
    '6. Defects Summary',
    '7. Recommendations',
  ];
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  toc.forEach((item, index) => {
    doc.text(item, 20, yPosition + (index * 7));
  });
  
  yPosition += (toc.length * 7) + 15;
  
  // 1. Executive Summary
  doc.addPage();
  yPosition = 50;
  yPosition = addSectionTitle(doc, '1. Executive Summary', yPosition);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const summary = doc.splitTextToSize(
    `This comprehensive report provides a detailed overview of the ${data.project?.title || 'project'}, including requirements, test cases, execution results, and defect tracking. The report is generated to provide stakeholders with a complete picture of the project's quality status.`,
    165
  );
  doc.text(summary, 15, yPosition);
  yPosition += summary.length * 7 + 15;
  
  // Key Metrics
  const metrics = [
    ['Total Requirements', data.requirements?.length || 0],
    ['Total Test Cases', data.testCases?.length || 0],
    ['Test Execution Pass Rate', `${data.statistics?.passRate || 0}%`],
    ['Open Defects', data.defects?.filter(d => d.status === 'Open').length || 0],
    ['Project Status', data.project?.projectStatus || 'N/A'],
  ];
  
  doc.autoTable({
    startY: yPosition,
    head: [['Key Metric', 'Value']],
    body: metrics,
    theme: 'grid',
    headStyles: { fillColor: [26, 38, 74] },
    margin: { left: 15, right: 15 },
  });
  
  yPosition = doc.lastAutoTable.finalY + 15;
  
  // 2. Project Information
  doc.addPage();
  yPosition = 50;
  yPosition = addSectionTitle(doc, '2. Project Information', yPosition);
  
  if (data.project) {
    const projectInfo = [
      ['Project Name', data.project.title || 'N/A'],
      ['Status', data.project.projectStatus || 'N/A'],
      ['Field', data.project.field || 'N/A'],
      ['Description', data.project.description || 'N/A'],
      ['Created Date', formatDate(data.project.createdAt)],
      ['Last Updated', formatDate(data.project.updatedAt)],
    ];
    
    doc.autoTable({
      startY: yPosition,
      body: projectInfo,
      theme: 'plain',
      margin: { left: 15 },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 140 },
      },
    });
    
    yPosition = doc.lastAutoTable.finalY + 15;
  }
  
  // 3. Requirements Overview
  doc.addPage();
  yPosition = 50;
  yPosition = addSectionTitle(doc, '3. Requirements Overview', yPosition);
  
  if (data.requirements && data.requirements.length > 0) {
    const reqData = data.requirements.map((req, index) => [
      index + 1,
      req.title,
      req.type || 'N/A',
      req.priority || 'N/A',
      req.status || 'N/A',
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['#', 'Title', 'Type', 'Priority', 'Status']],
      body: reqData,
      theme: 'striped',
      headStyles: { fillColor: [26, 38, 74] },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9 },
    });
    
    yPosition = doc.lastAutoTable.finalY + 15;
  }
  
  // 4. Test Cases Overview
  doc.addPage();
  yPosition = 50;
  yPosition = addSectionTitle(doc, '4. Test Cases Overview', yPosition);
  
  if (data.testCases && data.testCases.length > 0) {
    const tcData = data.testCases.slice(0, 20).map((tc, index) => [
      index + 1,
      tc.title,
      tc.priority || 'N/A',
      tc.type || 'N/A',
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['#', 'Title', 'Priority', 'Type']],
      body: tcData,
      theme: 'striped',
      headStyles: { fillColor: [26, 38, 74] },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9 },
    });
    
    if (data.testCases.length > 20) {
      yPosition = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`... and ${data.testCases.length - 20} more test cases`, 15, yPosition);
    }
  }
  
  // 5. Test Execution Summary
  doc.addPage();
  yPosition = 50;
  yPosition = addSectionTitle(doc, '5. Test Execution Summary', yPosition);
  
  if (data.executions && data.executions.length > 0) {
    const passed = data.executions.filter(e => e.result === 'Pass').length;
    const failed = data.executions.filter(e => e.result === 'Fail').length;
    const blocked = data.executions.filter(e => e.result === 'Blocked').length;
    const skipped = data.executions.filter(e => e.result === 'Skip').length;
    
    const execStats = [
      ['Total Executions', data.executions.length],
      ['Passed', passed],
      ['Failed', failed],
      ['Blocked', blocked],
      ['Skipped', skipped],
      ['Pass Rate', `${((passed / data.executions.length) * 100).toFixed(1)}%`],
    ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: execStats,
      theme: 'grid',
      headStyles: { fillColor: [26, 38, 74] },
      margin: { left: 15, right: 15 },
    });
    
    yPosition = doc.lastAutoTable.finalY + 15;
  }
  
  // 6. Defects Summary
  doc.addPage();
  yPosition = 50;
  yPosition = addSectionTitle(doc, '6. Defects Summary', yPosition);
  
  if (data.defects && data.defects.length > 0) {
    const defectData = data.defects.slice(0, 15).map((defect, index) => [
      index + 1,
      defect.title,
      defect.severity || 'N/A',
      defect.status || 'N/A',
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['#', 'Title', 'Severity', 'Status']],
      body: defectData,
      theme: 'striped',
      headStyles: { fillColor: [26, 38, 74] },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9 },
    });
    
    if (data.defects.length > 15) {
      yPosition = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`... and ${data.defects.length - 15} more defects`, 15, yPosition);
    }
  }
  
  // 7. Recommendations
  doc.addPage();
  yPosition = 50;
  yPosition = addSectionTitle(doc, '7. Recommendations', yPosition);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const recommendations = [
    'Continue monitoring test execution results and address any failing test cases.',
    'Prioritize resolution of high-severity defects before deployment.',
    'Ensure all requirements have adequate test coverage.',
    'Regular regression testing is recommended for critical functionality.',
    'Document lessons learned for future project improvements.',
  ];
  
  recommendations.forEach((rec, index) => {
    const bullet = `${index + 1}. ${rec}`;
    const lines = doc.splitTextToSize(bullet, 165);
    doc.text(lines, 15, yPosition);
    yPosition += lines.length * 7 + 5;
  });
  
  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }
  
  doc.save(`${data.project?.title || 'Project'}_Comprehensive_Report_${Date.now()}.pdf`);
};

/**
 * Generate Test Execution Report
 */
export const generateExecutionReportPDF = (executions, runName = 'Test Run') => {
  const doc = new jsPDF();
  let yPosition = 55;
  
  addHeader(doc, 'Test Execution Report');
  
  // Summary
  yPosition = addSectionTitle(doc, '1. Execution Summary', yPosition);
  
  const passed = executions.filter(e => e.result === 'Pass').length;
  const failed = executions.filter(e => e.result === 'Fail').length;
  const blocked = executions.filter(e => e.result === 'Blocked').length;
  const skipped = executions.filter(e => e.result === 'Skip').length;
  
  const summary = [
    ['Test Run', runName],
    ['Total Executions', executions.length],
    ['Passed', passed],
    ['Failed', failed],
    ['Blocked', blocked],
    ['Skipped', skipped],
    ['Pass Rate', `${executions.length > 0 ? ((passed / executions.length) * 100).toFixed(1) : 0}%`],
  ];
  
  doc.autoTable({
    startY: yPosition,
    body: summary,
    theme: 'grid',
    headStyles: { fillColor: [26, 38, 74] },
    margin: { left: 15, right: 15 },
  });
  
  yPosition = doc.lastAutoTable.finalY + 15;
  
  // Execution Details
  yPosition = checkNewPage(doc, yPosition);
  yPosition = addSectionTitle(doc, '2. Execution Details', yPosition);
  
  const execData = executions.map((exec, index) => [
    index + 1,
    exec.testCaseTitle || 'N/A',
    exec.result || 'N/A',
    exec.executedBy || 'N/A',
    formatDate(exec.executedAt),
  ]);
  
  doc.autoTable({
    startY: yPosition,
    head: [['#', 'Test Case', 'Result', 'Executed By', 'Date']],
    body: execData,
    theme: 'striped',
    headStyles: { fillColor: [26, 38, 74] },
    margin: { left: 15, right: 15 },
    styles: { fontSize: 9 },
  });
  
  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }
  
  doc.save(`Execution_Report_${Date.now()}.pdf`);
};
