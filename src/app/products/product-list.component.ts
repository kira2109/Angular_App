import { Component, OnInit } from "@angular/core";
import { IProduct } from "./product";
import { ProductService } from "./product.service";

@Component({
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"]
})
export class ProductListComponent implements OnInit {
  pageTitle: string = "Product List";
  imageWidth: number = 50;
  imageMargin: number = 2;
  showImage: boolean = false;
  sortDef: object = {
    price: true,
    starRating: true
  };
  errorMessage: string;
  _listFilter: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.listFilter
      ? this.performFilter(this.listFilter)
      : this.products;
  }

  filteredProducts: IProduct[];
  products: IProduct[] = [];

  constructor(private productService: ProductService) {}

  onRatingClicked(message: string): void {
    this.pageTitle = "Product List: " + message;
  }

  performFilter(filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter(
      (product: IProduct) =>
        product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  sortProductsListBy(propertyName: string): void {
    if (this.sortDef[propertyName]) {
      this.filteredProducts = this.filteredProducts.sort(
        this.compareProducts(propertyName)
      );
      this.sortDef[propertyName] = false;
    } else {
      this.filteredProducts = this.filteredProducts.reverse();
      this.sortDef[propertyName] = true;
    }
  }

  compareProducts(property: string) {
    return (a: IProduct, b: IProduct) => a[property] - b[property];
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      products => {
        this.products = products;
        this.filteredProducts = this.products;
      },
      error => (this.errorMessage = <any>error)
    );
  }
}
