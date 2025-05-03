import React, { useEffect } from 'react';
import OptLogo from '../../assets/logo2.png';
import './redeem.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const redeem = ({ selectedItems, onClose }) => {
  const generateUniqueCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  //PDF
  const handleDownloadPDF = async () => {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const logoImg = new Image();
    logoImg.src = OptLogo;

    const logoWidth = 350;
    const logoHeight = 100;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    await new Promise(resolve => {
      logoImg.onload = resolve;
      logoImg.onerror = () => {
        console.warn("Failed to load logo image.");
        resolve();
      };
    });

    let y = 50; // Initial Y position
    for (let item of selectedItems) {
      const code = generateUniqueCode();
      const itemImg = new Image();
      const boxHeight = 350;
      const boxWidth = 500;
      const boxX = (pageWidth - boxWidth) / 2;
      const boxY = y;

      itemImg.crossOrigin = 'anonymous';
      itemImg.src = item.item_img;

      await new Promise(resolve => {
        itemImg.onload = () => {
          // Draw rectangle box
          pdf.setDrawColor(0);
          pdf.setLineWidth(1);
          pdf.rect(boxX, boxY, boxWidth, boxHeight);

          // Logo (top center inside box)
          const logoX = boxX + (boxWidth - logoWidth) / 2;
          pdf.addImage(logoImg, 'PNG', logoX, boxY + 10, logoWidth, logoHeight);

          // Item image (left side)
          const imgX = boxX + 20;
          const imgY = boxY + 120;
          pdf.addImage(itemImg, 'PNG', imgX, imgY, 180, 180);

          // Text (right side, vertical)
          const textX = imgX + 200;
          let textY = imgY + 15;

          pdf.setFont('Poppins', 'normal');
          pdf.setFontSize(20);
          pdf.text(`Name: ${item.item_name}`, textX, textY);
          textY += 50;

          pdf.setFont('Open Sans', 'normal');
          pdf.text(`Quantity: ${item.quantity}`, textX, textY);
          textY += 50;
          pdf.text(`Code: ${code}`, textX, textY);
          y += boxHeight + 20;
          if (y + boxHeight > pageHeight) {
            pdf.addPage();
            y = 50;
          }
          resolve();
        };
        
        itemImg.onerror = () => {
          console.warn(`Failed to load image for ${item.item_name}`);
          y += boxHeight + 20;

          if (y + boxHeight > pageHeight) {
            pdf.addPage();
            y = 50;
          }
          resolve();
        };
      });
    }
    pdf.save('OptimaBank.pdf');
  }
  return (
    <div className="popupOverlay">
      <div className="popupContent">
        <h2>Successfully Redeemed!</h2>
        <p>Thank you for redeeming your items:</p>
        <ul>
          {selectedItems.map((item, i) => (
            <li key={i}>{item.item_name} (x{item.quantity})</li>
          ))}
        </ul>
        <button className='btnPDF' onClick={handleDownloadPDF}>Download PDF</button>
        <button className='btnClose' onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default redeem
