import argparse
import re
from lxml import etree

# Input param
parser = argparse.ArgumentParser()
parser.add_argument("file", help="location of LIDO xml file to process")
args = parser.parse_args()

# Read & find text nodes
tree = etree.parse(args.file);
find_text = etree.XPath("//text()")

# Display xpath for non-void text nodes
for text in find_text(tree):
  if len(text.strip()) > 0:
    #print text.encode("utf8")
    print re.sub(r'\[\d*\]', r'', tree.getpath(text.getparent()))
