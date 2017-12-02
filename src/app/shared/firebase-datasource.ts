import { Component } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Sortable Interface - Used for specifying the sort order.
 */
export interface Sort {
  field: string;
  direction: '' | 'asc' | 'desc';
}

/**
 * FirebaseDataSource is a templated datasource for Firebase. At this stage it
 * allows:
 *   *  Tracking data updates to the underlying datarecords.
 *   *  Sorting ascending and descending
 *
 * We have not implemented paging controls as its too difficult with NoSQL. It also
 * does not support multi-field sorting.
 */
export class FirebaseDataSource<T> extends DataSource<T> {
  /**
   * The datachange subscriber emits new data when the Firebase records are updated.
   */
  dataChange: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  /**
   * The sort change is updated when the sort order is changed.
   */
  sortChange: BehaviorSubject<Sort> = new BehaviorSubject<Sort>({field: '', direction: ''});

  /**
   * Path tracks the path of the list of records. e.g. /items
   */
  path: string;

  /**
   * Keep for cleaning up the subscription
   */
  private _sub: Subscription;

  /**
   * Getters and setters for setting sort order.
   */
  get sort(): Sort {
    return this.sortChange.value;
  }

  set sort(sort: Sort) {
    this.sortChange.next(sort);
  }

  /**
   * Construct an instance of the datasource.
   *
   * @param path The Firebase Path e.g. /items
   * @param db Injectable AngularFireDatabase
   * @param sort Optional initial sort order for the list.
   */
  constructor(
    path: string,
    protected db: AngularFireDatabase,
    sort?: Sort) {
    super();
    this.path = path;
    /**
     * Sets up a subscriber to the path and emits data change events.
     */
    this._sub = this.db.list<T>(this.path).valueChanges()
      .subscribe((data: T[]) => {
        this.dataChange.next(data);
      });

    if (sort) {
      this.sort = sort;
    }
  }

  /**
   * Connect to the data source, retrieve initial data, and observe changes.
   * It tracks changes to either the underlying data, or to the sort order and remaps
   * the query.
   *
   * @returns Observable<T[]>
   */
  connect(): Observable<T[]> {
    const dataChanges = [
      this.dataChange,
      this.sortChange
    ];
    const _that = this;

    return Observable.merge(...dataChanges)
      .switchMap(() => {
        if (_that.sort.field !== '' && _that.sort.direction !== '') {
          return this.db.list(this.path, ref => ref.orderByChild(this.sort.field)).valueChanges<T>()
            .map((data: T[]) => {
              if (_that.sort.direction === 'desc') {
                return data.reverse();
              } else {
                return data;
              }
            });
        } else {
          return this.db.list(this.path).valueChanges<T>();
        }
      });
  }

  /**
   * Cleans up the open subscription.
   */
  disconnect() {
    this._sub.unsubscribe();
  }
}
