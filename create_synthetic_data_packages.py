import quilt3

def move_nothing(lk, entry):
    return False

def create_pkg(file_size_str, dataset_size):
    pkg = quilt3.Package()
    pkg.set_dir(f"{file_size_str}/", f"s3://quilt-example/data/random-data-benchmark/{file_size_str}/{dataset_size}")
    pkg.push(f"random-data-benchmark/{file_size_str}-{dataset_size}", registry="s3://quilt-example/", selector_fn=move_nothing)


def create_100kb_pkg():
    create_pkg("100kb", "100mb")

def create_1mb_pkg():
    create_pkg("1mb", "1gb")

def create_10mb_pkg():
    create_pkg("10mb", "1gb")

def create_100mb_pkg():
    create_pkg("100mb", "1gb")

# def create_1gb_pkg():
#     create_pkg("1gb", "10gb")



if __name__ == '__main__':
    create_100kb_pkg()
    create_1mb_pkg()
    create_10mb_pkg()
    create_100mb_pkg()
    # create_1gb_pkg()


