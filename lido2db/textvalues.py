import argparse
import sys
from lxml import etree

# Input param
parser = argparse.ArgumentParser()
parser.add_argument("file", help="location of LIDO xml file to process")
args = parser.parse_args()

# Read inputs
tree = etree.parse(args.file);
f = sys.stdin;
namespaces = {'lido': 'http://www.lido-schema.org'}

# Count different text values for given xpaths
for line in f.readlines():
  line = line.strip()
  xpath = line+"/text()"
  #xpath = "//lido:lidoWrap//text()"
  print xpath
  find_text = etree.XPath(xpath, namespaces=namespaces)
  count = {}
  for text in find_text(tree):
    #print text.__class__.__name__
    text = text.strip()
    #print text
    if len(text) > 0:
      if text in count:
        count[text] += 1
      else:
        count[text] = 1
  for text, times in count.items():
    print "  %d; %s" % (times, text.encode("utf8"))
