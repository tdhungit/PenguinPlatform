import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Table,
    Alert,
    Input
} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Bert} from 'meteor/themeteorchef:bert';
import {vsprintf} from 'sprintf-js';
import BootstrapPaginator from 'react-bootstrap-pagination';

import {T} from '/imports/common/Translation';
import container from '/imports/common/Container';
import {Loading} from '../../../components/Loading/Loading';
import {FieldView, FieldButton, FieldInput} from '../../../components/Fields/Fields';
import {utilsHelper} from '../../../helpers/utils/utils';
import {t} from '/imports/common/Translation';

/**
 * list for a collection
 */
class ListContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filters: {},
            sort: {}
        };

        this.onFilter = this.onFilter.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

    componentWillMount() {
        const {type, model} = this.props;
        this.listFields = model.list.fields;

        if (type === 'Panel' && model.panel && model.panel.fields) {
            this.listFields = model.panel.fields;
        }

        if (type === 'Select' && model.select && model.select.fields) {
            this.listFields = model.select.fields;
        }
    }

    renderHeader() {
        let headers = [];
        headers.push(<th key="input" className="NoSortLink"></th>);

        for (let fieldName in this.listFields) {
            let field = this.listFields[fieldName];
            headers.push(
                <th key={fieldName} className={this.getSortClass(fieldName)}
                    onClick={() => this.handleSort(fieldName)}>
                    <T>{field.label || fieldName}</T>
                </th>
            )
        }

        headers.push(<th key="actions" className="NoSortLink"></th>);
        return headers;
    }

    renderFilterForm() {
        let filters = [];
        filters.push(<td key="input"></td>);

        for (let fieldName in this.listFields) {
            let field = this.listFields[fieldName];
            filters.push(
                <td key={fieldName}>
                    <FieldInput name={fieldName}
                                type={field.type}
                                options={field.options}
                                placeholder={t.__(field.label)}
                                value={this.getFilter(fieldName)}
                                onChange={this.onFilter}/>
                </td>
            )
        }

        filters.push(
            <td key="actions">
                <FieldButton label="Filter" color="primary" onClick={this.handleFilter}/>
            </td>
        );

        return filters;
    }

    onFilter(event) {
        const filters = utilsHelper.inputChange(event, this.state.filters);
        this.setState({filters: filters});
    }

    getFilter(filter) {
        return utilsHelper.getField(this.state.filters, filter);
    }

    handleFilter() {
        this.props.pagination.filters(this.state.filters);
    }

    getSortType(fieldName) {
        return this.state.sort[fieldName] ? (this.state.sort[fieldName]) : 0;
    }

    getSortClass(fieldName) {
        const sortType = this.getSortType(fieldName);
        if (sortType === -1) {
            return 'asc';
        } else if (sortType === 1) {
            return 'desc'
        }

        return '';
    }

    handleSort(fieldName) {
        let sortType = this.getSortType(fieldName);
        if (!sortType) {
            sortType = 1;
        } else {
            sortType = 0 - sortType
        }

        const sort = {[fieldName]: sortType};
        this.setState({sort: sort});

        this.props.pagination.sort({[fieldName]: sortType});
    }

    renderCol(record) {
        let cols = [];
        // input column
        if (this.props.type === 'Select') {
            cols.push(
                <td key="input">
                    <Input type="checkbox" className="initEl"/>
                </td>
            );
        }
        // content columns
        for (let fieldName in this.listFields) {
            let field = this.listFields[fieldName];
            field.name = fieldName;
            let col = (
                <td key={fieldName}>
                    <FieldView record={record} field={field}/>
                </td>
            );

            cols.push(col)
        }
        // action column
        cols.push(
            <td key="actions">
                {this.props.detailLink ?
                <Link to={vsprintf(this.props.detailLink, [record._id])} className="btn btn-sm btn-link">
                    <i className="fa fa-eye"/>
                </Link> : null}

                {this.props.editLink ?
                <Link to={vsprintf(this.props.editLink, [record._id])} className="btn btn-sm btn-link text-warning">
                    <i className="fa fa-edit"/>
                </Link> : null}

                {this.props.type !== 'Select' ?
                <a href="javascript:void(0)" className="btn btn-sm btn-link text-danger">
                    <i className="fa fa-trash"/>
                </a> : null}
            </td>
        );

        return cols;
    }

    renderRows() {
        return this.props.records.map((record) => {
            return (
                <tr key={record._id}>
                    {this.renderCol(record)}
                </tr>
            );
        });
    }

    render() {
        return (
            <Row>
                <Col>
                    <Table bordered hover className="table-sortable">
                        <thead>
                        <tr>{this.renderHeader()}</tr>
                        </thead>
                        <tbody>
                        <tr>{this.renderFilterForm()}</tr>
                        {this.props.records.length > 0
                            ? this.renderRows()
                            : null}
                        </tbody>
                    </Table>
                    {this.props.records.length <= 0
                        ? <Alert color="warning"><T>Empty Data.</T></Alert>
                        : null}
                    <BootstrapPaginator pagination={this.props.pagination}
                                        limit={this.props.limit}
                                        containerClass="text-right"/>
                </Col>
            </Row>
        );
    }
}

/**
 * get server data
 */
const ListComponent = withRouter(container((props, onData) => {
    if (props.pagination.ready()) {
        const records = props.pagination.getPage();
        const totalPages = props.pagination.totalPages();
        onData(null, {
            records,
            totalPages
        });
    }
}, ListContainer, {loadingHandler: () => <Loading/>}));

/**
 * props type
 * @type {{model: *, pagination: *, limit: *, type: *, detailLink: *, editLink: *, records: *}}
 */
ListComponent.propTypes = {
    model: PropTypes.object,
    pagination: PropTypes.object,
    limit: PropTypes.number,
    type: PropTypes.string, // type is List OR Panel, default: List
    detailLink: PropTypes.string,
    editLink: PropTypes.string,
    records: PropTypes.array // from container
};

export default ListComponent;

/**
 * List Record from collection
 */
export class ListRecordsComponent extends Component {
    static propTypes = {
        type: PropTypes.string,
        collection: PropTypes.object,
        filters:  PropTypes.object,
        model:  PropTypes.object,
        createLink: PropTypes.string,
        editLink: PropTypes.string,
        detailLink: PropTypes.string
    };

    componentWillMount() {
        const {collection, filters} = this.props;
        let options = filters ? {filters: filters} : {};
        this.pagination = collection.pagination(options);
        this.limit = collection.getLimit();
    }

    render() {
        const {limit, pagination} = this;
        const {type, model, editLink, detailLink} = this.props;

        return (
            <ListComponent
                type={type}
                model={model}
                pagination={pagination}
                limit={limit}
                detailLink={detailLink}
                editLink={editLink}/>
        );
    }
}

/**
 * List View Tag
 */
export class ListViewComponent extends Component {
    static propTypes = {
        collection: PropTypes.object,
        filters:  PropTypes.object,
        model:  PropTypes.object,
        createLink: PropTypes.string,
        editLink: PropTypes.string,
        detailLink: PropTypes.string,
        className: PropTypes.string,
        title: PropTypes.string
    };

    render() {
        const {className, title, collection, filters, model, createLink, editLink, detailLink} = this.props;

        return (
            <div className={className + ' animated fadeIn'}>
                <PT title={title}/>

                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <i className={model.icon}/> {title}
                                <div className="card-actions">
                                    <Link to={createLink} title={t.__('Create')}>
                                        <i className="fa fa-plus-circle"/>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <ListRecordsComponent
                                    collection={collection}
                                    filters={filters}
                                    model={model}
                                    detailLink={detailLink}
                                    editLink={editLink}/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
