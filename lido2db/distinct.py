import sys

count = {}
file = sys.stdin
lines = file.readlines()

for line in lines:
    if line in count:
        count[line] += 1
    else:
        count[line] = 1

for line, times in count.items():
    #print "%d; %s" % (times, line.strip())
    print "%s" % (line.strip())
