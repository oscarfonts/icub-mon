# Count all distinct text values in a collection of LIDO files
for in in data/*.xml
do
  out=${in/.xml/_values.txt}
  echo "$in => $out"
  python textpaths.py $in | python distinct.py | python textvalues.py $in > $out
done
