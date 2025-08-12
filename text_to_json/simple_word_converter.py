#!/usr/bin/env python3
"""
Simple Word to JSON converter for MECRA website.
Converts Word document to JSON format similar to texts.json structure.
"""

import json
import os
import re
from docx import Document
from docx.shared import RGBColor

def extract_formatted_content(docx_path):
    """Extract content from Word document with proper formatting."""
    document = Document(docx_path)
    sections = []
    current_section = None
    
    for para in document.paragraphs:
        if not para.text.strip():
            continue
            
        # Extract text with formatting
        formatted_text = ""
        for run in para.runs:
            text = run.text
            if text:
                # Apply bold formatting with HTML tags
                if run.bold:
                    text = f"<b>{text}</b>"
                formatted_text += text
        
        if not formatted_text.strip():
            continue
            
        # Detect if this is a title/header (bold text or short line)
        is_title = (any(run.bold for run in para.runs if run.text.strip()) and 
                   len(formatted_text.strip()) < 100) or para.style.name.startswith('Heading')
        
        # Detect bullet points
        is_bullet = (formatted_text.strip().startswith('-') or 
                    formatted_text.strip().startswith('•') or
                    formatted_text.strip().startswith('*') or
                    any(char in formatted_text[:10] for char in ['–', '—']))
        
        if is_title:
            # Start new section
            if current_section and current_section['content']:
                sections.append(current_section)
            
            current_section = {
                'title': formatted_text.strip(),
                'type': 'section',
                'content': []
            }
        else:
            # Add to current section or create general section
            if not current_section:
                current_section = {
                    'title': 'Content',
                    'type': 'section',
                    'content': []
                }
            
            # Format content based on type
            if is_bullet:
                # Clean bullet and add water drop emoji
                clean_text = formatted_text.strip()
                # Remove existing bullets
                clean_text = re.sub(r'^[-•*–—]\s*', '', clean_text)
                formatted_content = f"💧 {clean_text}"
            else:
                formatted_content = formatted_text.strip()
            
            current_section['content'].append({
                'text': formatted_content,
                'is_bullet': is_bullet
            })
    
    # Don't forget the last section
    if current_section and current_section['content']:
        sections.append(current_section)
    
    return sections

def format_content_for_web(sections):
    """Format the extracted content for web display."""
    formatted_sections = {}
    
    for i, section in enumerate(sections):
        section_key = section['title'].lower().replace(' ', '_').replace('?', '').replace('.', '')
        section_key = re.sub(r'[^a-z0-9_]', '', section_key)
        
        if not section_key:
            section_key = f"section_{i+1}"
        
        # Group content by bullet vs paragraph
        content_parts = []
        current_paragraph = []
        
        for item in section['content']:
            if item['is_bullet']:
                # If we have accumulated paragraph text, add it first
                if current_paragraph:
                    content_parts.append("<br><br>".join([p['text'] for p in current_paragraph]))
                    current_paragraph = []
                # Add bullet with single line break
                content_parts.append(item['text'])
            else:
                current_paragraph.append(item)
        
        # Add any remaining paragraph content
        if current_paragraph:
            content_parts.append("<br><br>".join([p['text'] for p in current_paragraph]))
        
        # Join content with appropriate breaks
        formatted_content = ""
        for j, part in enumerate(content_parts):
            if j > 0:
                # Determine break type
                prev_is_bullet = content_parts[j-1].startswith('💧')
                curr_is_bullet = part.startswith('💧')
                
                if prev_is_bullet and curr_is_bullet:
                    formatted_content += "<br>"  # Single break between bullets
                else:
                    formatted_content += "<br><br>"  # Double break otherwise

            formatted_content += part
        
        formatted_sections[section_key] = {
            'title': section['title'],
            'content': formatted_content
        }
    
    return formatted_sections

def create_website_json(formatted_sections):
    """Create JSON structure similar to texts.json format."""
    
    # Initialize structure
    website_data = {
        "document_content": {}
    }
    
    # Add all sections
    for key, section in formatted_sections.items():
        website_data["document_content"][key] = {
            "title": section['title'],
            "text": section['content']
        }
    
    return website_data

def main():
    """Main conversion function."""
    docx_path = "Who We Are.docx"
    docx_path2 = "Biz Kimiz.docx"
    
    if not os.path.exists(docx_path):
        print(f"❌ Error: {docx_path} not found!")
        print("Please make sure the Word document is in the same folder as this script.")
        return
    
    print("📄 Reading Word document...")
    
    try:
        # Extract content with formatting
        sections = extract_formatted_content(docx_path)
        print(f"📝 Found {len(sections)} sections")
        
        # Format for web
        formatted_sections = format_content_for_web(sections)
        print("🔧 Formatted content for web display")
        
        # Create JSON structure
        website_json = create_website_json(formatted_sections)
        print("📋 Created JSON structure")
        
        # Save output
        output_file = "converted_content.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(website_json, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Successfully converted to: {output_file}")
        
        # Print summary
        print(f"<br><br>📊 Conversion Summary:")
        print(f"   • Total sections: {len(formatted_sections)}")
        for key, section in formatted_sections.items():
            bullet_count = section['content'].count('💧')
            print(f"   • {section['title']}: {len(section['content'])} chars, {bullet_count} bullets")
        
        print(f"<br><br>💡 Usage Notes:")
        print(f"   • Line breaks: <br><br> for paragraphs, <br> for bullets")
        print(f"   • Bold text: <b>text</b> format")
        print(f"   • Bullets: 💧 emoji prefix")
        print(f"   • Ready for copy-paste into your website JSON")

        sections2 = extract_formatted_content(docx_path2)
        print(f"📝 Found {len(sections2)} sections in {docx_path2}")

        formatted_sections2 = format_content_for_web(sections2)
        print("🔧 Formatted content for web display from second document")

        # Create JSON structure for second document
        website_json2 = create_website_json(formatted_sections2)
        print("📋 Created JSON structure for second document")

        # Save output for second document
        output_file2 = "converted_content_biz_kimiz.json"
        with open(output_file2, 'w', encoding='utf-8') as f:
            json.dump(website_json2, f, indent=2, ensure_ascii=False)

        print(f"✅ Successfully converted second document to: {output_file2}")

        # Print summary for second document
        print(f"<br><br>📊 Conversion Summary for {docx_path2}:")
        print(f"   • Total sections: {len(formatted_sections2)}")
        for key, section in formatted_sections2.items():
            bullet_count = section['content'].count('💧')
            print(f"   • {section['title']}: {len(section['content'])} chars, {bullet_count} bullets")

        print(f"<br><br>💡 Usage Notes for second document:")

        print(f"   • Line breaks: <br><br> for paragraphs, <br> for bullets")
        print(f"   • Bold text: <b>text</b> format")
        print(f"   • Bullets: 💧 emoji prefix")
        print(f"   • Ready for copy-paste into your website JSON")
        
    except Exception as e:
        print(f"❌ Error during conversion: {e}")
        print("Please check that the Word document is not corrupted and try again.")

if __name__ == "__main__":
    main()
