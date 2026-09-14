import zipfile, os, sys
def rezip(src,dst):
    zin=zipfile.ZipFile(src); names=zin.namelist()
    order=[n for n in names if n=='[Content_Types].xml']+[n for n in names if n!='[Content_Types].xml']
    with zipfile.ZipFile(dst,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as zo:
        for n in order:
            zi=zin.getinfo(n); new=zipfile.ZipInfo(zi.filename,date_time=zi.date_time)
            new.compress_type=zipfile.ZIP_DEFLATED; new.external_attr=zi.external_attr
            zo.writestr(new, zin.read(n))
    return os.path.getsize(dst)
if __name__=='__main__':
    print(rezip(sys.argv[1],sys.argv[2]))
